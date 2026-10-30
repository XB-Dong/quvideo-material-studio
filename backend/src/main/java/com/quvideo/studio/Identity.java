package com.quvideo.studio;

import jakarta.servlet.http.*;
import java.security.*;
import java.time.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

@Service
public class Identity {
  private final Db db;
  private final TransactionTemplate tx;
  private final SecureRandom random = new SecureRandom();

  @Value("${SESSION_TTL_DAYS:7}")
  private int days;

  @Value("${SESSION_COOKIE_SECURE:false}")
  private boolean secure;

  public Identity(Db db, TransactionTemplate tx) {
    this.db = db;
    this.tx = tx;
  }

  static String hash(String s) {
    try {
      return HexFormat.of()
          .formatHex(
              MessageDigest.getInstance("SHA-256")
                  .digest(s.getBytes(java.nio.charset.StandardCharsets.UTF_8)));
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException(e);
    }
  }

  private String currentHash(HttpServletRequest req) {
    if (req.getCookies() != null)
      for (Cookie c : req.getCookies())
        if (c.getName().equals("material_session")) return hash(c.getValue());
    return null;
  }

  Map<String, Object> find(HttpServletRequest req) {
    String hash = currentHash(req);
    if (hash == null) return null;
    var raw = db.sessionByHash(hash);
    if (raw == null) return null;
    var view = new HashMap<String, Object>();
    view.put("userId", raw.get("userId"));
    view.put("displayName", raw.get("displayName"));
    view.put("expiresAt", raw.get("expiresAt"));
    view.put("kind", raw.get("email") == null ? "GUEST" : "ACCOUNT");
    view.put("email", raw.get("email"));
    view.put("emailVerified", false);
    return view;
  }

  Map<String, Object> require(HttpServletRequest req) {
    var found = find(req);
    if (found == null) throw new Problem(401, "UNAUTHENTICATED", "身份已失效，请重新连接");
    return found;
  }

  void revokeCurrent(HttpServletRequest req) {
    String hash = currentHash(req);
    if (hash != null) db.revokeSession(hash);
  }

  record Issued(String token, Map<String, Object> session) {}

  Issued issue(String user) {
    byte[] bytes = new byte[32];
    random.nextBytes(bytes);
    String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    db.session(hash(token), user, LocalDateTime.now(ZoneOffset.UTC).plusDays(days));

    return new Issued(token, sessionForHash(hash(token)));
  }

  private Map<String, Object> sessionForHash(String tokenHash) {
    var raw = db.sessionByHash(tokenHash);
    var view = new HashMap<String, Object>();
    view.put("userId", raw.get("userId"));
    view.put("displayName", raw.get("displayName"));
    view.put("expiresAt", raw.get("expiresAt"));
    view.put("kind", raw.get("email") == null ? "GUEST" : "ACCOUNT");
    view.put("email", raw.get("email"));
    view.put("emailVerified", false);
    return view;
  }

  Issued newGuest() {
    String id = UUID.randomUUID().toString();
    db.user(id, "创作者 " + id.substring(0, 6));
    return issue(id);
  }

  void cookie(HttpServletResponse res, String token) {
    res.addHeader(
        "Set-Cookie",
        org.springframework.http.ResponseCookie.from("material_session", token)
            .httpOnly(true)
            .secure(secure)
            .sameSite("Lax")
            .path("/")
            .maxAge(Duration.ofDays(days))
            .build()
            .toString());
  }

  Map<String, Object> ensure(HttpServletRequest req, HttpServletResponse res) {
    var current = find(req);
    if (current != null) return current;
    var issued = tx.execute(s -> newGuest());
    cookie(res, issued.token());
    return issued.session();
  }
}
