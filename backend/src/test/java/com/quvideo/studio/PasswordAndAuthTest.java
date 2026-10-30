package com.quvideo.studio;

import static org.junit.jupiter.api.Assertions.*;

import java.time.*;
import java.util.*;
import org.junit.jupiter.api.Test;

class PasswordAndAuthTest {
  @Test
  void saltedPbkdf2VerifiesWithoutStoringPlaintext() {
    var p = new PasswordHasher();
    var a = p.encode("Synthetic-password-2026!");
    var b = p.encode("Synthetic-password-2026!");
    assertNotEquals(a.salt(), b.salt());
    assertNotEquals(a.hash(), b.hash());
    assertEquals(600000, a.iterations());
    assertEquals(16, Base64.getDecoder().decode(a.salt()).length);
    assertEquals(32, Base64.getDecoder().decode(a.hash()).length);
    assertTrue(p.verify("Synthetic-password-2026!", a));
    assertFalse(p.verify("Wrong-password-2026!", a));
    assertFalse(p.verify("Synthetic-password-2026!", (Map<String, Object>) null));
  }

  @Test
  void failureThrottleExpiresAndSuccessfulAttemptsDoNotCount() {
    class Mutable extends Clock {
      long time = 1000;

      public ZoneId getZone() {
        return ZoneOffset.UTC;
      }

      public Clock withZone(ZoneId z) {
        return this;
      }

      public Instant instant() {
        return Instant.ofEpochMilli(time);
      }
    }
    var clock = new Mutable();
    var t = new AuthThrottle(clock);
    for (int i = 0; i < 8; i++) assertEquals("ok", t.attempt("success", () -> "ok"));
    for (int i = 0; i < 5; i++)
      assertEquals(
          401,
          assertThrows(
                  Problem.class,
                  () ->
                      t.attempt(
                          "failed",
                          () -> {
                            throw new Problem(401, "AUTH_INVALID", "wrong");
                          }))
              .status);
    assertEquals(429, assertThrows(Problem.class, () -> t.attempt("failed", () -> "no")).status);
    clock.time += 300000;
    assertEquals("ok", t.attempt("failed", () -> "ok"));
  }
}
