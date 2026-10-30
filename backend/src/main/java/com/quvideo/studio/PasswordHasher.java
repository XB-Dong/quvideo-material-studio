package com.quvideo.studio;

import java.security.*;
import java.util.*;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import org.springframework.stereotype.Component;

@Component
public class PasswordHasher {
  static final String ALGORITHM = "PBKDF2WithHmacSHA256";
  static final int ITERATIONS = 600000;
  private final SecureRandom random = new SecureRandom();

  public record Encoded(String algorithm, int iterations, String salt, String hash) {}

  private final Encoded dummy = encode("Dummy-account-password-not-a-credential");

  Encoded encode(String password) {
    byte[] salt = new byte[16];
    random.nextBytes(salt);
    return new Encoded(
        ALGORITHM,
        ITERATIONS,
        Base64.getEncoder().encodeToString(salt),
        Base64.getEncoder().encodeToString(derive(password, salt, ITERATIONS)));
  }

  boolean verify(String password, Map<String, Object> stored) {
    if (stored == null) return verify(password, dummy);
    return verify(
        password,
        new Encoded(
            (String) stored.get("algorithm"),
            ((Number) stored.get("iterations")).intValue(),
            (String) stored.get("salt"),
            (String) stored.get("passwordHash")));
  }

  boolean verify(String password, Encoded stored) {
    if (!ALGORITHM.equals(stored.algorithm()) || stored.iterations() != ITERATIONS) return false;
    return MessageDigest.isEqual(
        Base64.getDecoder().decode(stored.hash()),
        derive(password, Base64.getDecoder().decode(stored.salt()), stored.iterations()));
  }

  private static byte[] derive(String password, byte[] salt, int iterations) {
    PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, iterations, 256);
    try {
      return SecretKeyFactory.getInstance(ALGORITHM).generateSecret(spec).getEncoded();
    } catch (GeneralSecurityException e) {
      throw new IllegalStateException("Password hashing unavailable", e);
    } finally {
      spec.clearPassword();
    }
  }
}
