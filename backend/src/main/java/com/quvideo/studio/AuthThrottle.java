package com.quvideo.studio;

import java.time.*;
import java.util.*;
import java.util.function.Supplier;
import org.springframework.stereotype.Component;

@Component
public class AuthThrottle {
  private static final long WINDOW = 300000;
  private static final int CAPACITY = 10000;
  private final Clock clock;
  private final Map<String, Bucket> buckets = new HashMap<>();

  private static class Bucket {
    int failures;
    volatile long start;

    Bucket(long now) {
      start = now;
    }
  }

  public AuthThrottle() {
    this(Clock.systemUTC());
  }

  AuthThrottle(Clock clock) {
    this.clock = clock;
  }

  <T> T attempt(String key, Supplier<T> action) {
    Bucket b;
    synchronized (buckets) {
      long now = clock.millis();
      buckets.entrySet().removeIf(e -> now - e.getValue().start >= WINDOW);
      b = buckets.get(key);
      if (b == null) {
        if (buckets.size() >= CAPACITY) throw limited();
        b = new Bucket(now);
        buckets.put(key, b);
      }
    }
    synchronized (b) {
      if (clock.millis() - b.start >= WINDOW) {
        b.failures = 0;
        b.start = clock.millis();
      }
      if (b.failures >= 5) throw limited();
      try {
        T result = action.get();
        b.failures = 0;
        return result;
      } catch (Problem p) {
        if (p.status == 401) b.failures++;
        throw p;
      }
    }
  }

  private static Problem limited() {
    return new Problem(429, "AUTH_RATE_LIMITED", "登录尝试过多，请稍后再试");
  }
}
