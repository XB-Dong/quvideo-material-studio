package com.quvideo.studio;

import jakarta.servlet.http.*;
import java.util.*;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

@Service
public class AccountService {
  public record Register(String displayName, String email, String password) {}

  public record Login(String email, String password) {}

  public record Profile(String displayName) {}

  public record ChangePassword(String currentPassword, String newPassword) {}

  private final Db db;
  private final Identity identity;
  private final PasswordHasher passwords;
  private final AuthThrottle throttle;
  private final TransactionTemplate tx;

  public AccountService(
      Db db,
      Identity identity,
      PasswordHasher passwords,
      AuthThrottle throttle,
      TransactionTemplate tx) {
    this.db = db;
    this.identity = identity;
    this.passwords = passwords;
    this.throttle = throttle;
    this.tx = new TransactionTemplate(tx.getTransactionManager());
    this.tx.setIsolationLevel(
        org.springframework.transaction.TransactionDefinition.ISOLATION_READ_COMMITTED);
  }

  private static String email(String input) {
    if (input == null) throw Problem.invalid("请输入登录邮箱");
    String value = input.trim().toLowerCase(Locale.ROOT);
    if (value.length() > 254 || !value.matches("[^\\s@]+@[^\\s@]+\\.[^\\s@]+"))
      throw Problem.invalid("邮箱格式不正确");
    return value;
  }

  private static String name(String input) {
    if (input == null) throw Problem.invalid("请输入昵称");
    String value = input.trim();
    if (value.isEmpty() || value.codePointCount(0, value.length()) > 30)
      throw Problem.invalid("昵称应为1到30个字符");
    return value;
  }

  private static String passwordValue(String input) {
    if (input == null
        || input.codePointCount(0, input.length()) < 12
        || input.codePointCount(0, input.length()) > 128) throw Problem.invalid("密码应为12到128个字符");
    return input;
  }

  private Map<String, Object> locked(HttpServletRequest req, boolean account) {
    var current = identity.require(req);
    db.lockUser((String) current.get("userId"));
    current = identity.require(req);
    if (account && !"ACCOUNT".equals(current.get("kind")))
      throw new Problem(403, "ACCOUNT_REQUIRED", "请先登录账户");
    return current;
  }

  Map<String, Object> register(HttpServletRequest req, HttpServletResponse res, Register body) {
    String e = email(body.email()),
        n = name(body.displayName()),
        p = passwordValue(body.password());
    var encoded = passwords.encode(p);
    Identity.Issued issued;
    try {
      issued =
          tx.execute(
              s -> {
                var current = locked(req, false);
                if (!"GUEST".equals(current.get("kind")))
                  throw new Problem(409, "ACCOUNT_EXISTS", "当前身份已是注册账户");
                String id = (String) current.get("userId");
                db.credentials(
                    id,
                    e,
                    encoded.algorithm(),
                    encoded.iterations(),
                    encoded.salt(),
                    encoded.hash());
                db.renameUser(id, n);
                db.revokeUserSessions(id);
                return identity.issue(id);
              });
    } catch (DuplicateKeyException ex) {
      throw new Problem(409, "EMAIL_IN_USE", "邮箱已被使用");
    }
    identity.cookie(res, issued.token());
    return issued.session();
  }

  Map<String, Object> login(HttpServletRequest req, HttpServletResponse res, Login body) {
    String e = email(body.email()), p = passwordValue(body.password());
    return throttle.attempt(
        Identity.hash(e + "|" + req.getRemoteAddr()),
        () -> {
          var issued =
              tx.execute(
                  s -> {
                    var candidate = db.credentialsByEmail(e);
                    if (candidate == null) {
                      passwords.verify(p, (Map<String, Object>) null);
                      throw invalid();
                    }
                    String id = (String) candidate.get("userId");
                    db.lockUser(id);
                    candidate = db.credentialsByEmail(e);
                    if (!passwords.verify(p, candidate)) throw invalid();
                    identity.revokeCurrent(req);
                    return identity.issue(id);
                  });
          identity.cookie(res, issued.token());
          return issued.session();
        });
  }

  Map<String, Object> logout(HttpServletRequest req, HttpServletResponse res) {
    var issued =
        tx.execute(
            s -> {
              var current = identity.find(req);
              if (current != null) db.lockUser((String) current.get("userId"));
              identity.revokeCurrent(req);
              return identity.newGuest();
            });
    identity.cookie(res, issued.token());
    return issued.session();
  }

  Map<String, Object> profile(HttpServletRequest req, Profile body) {
    String n = name(body.displayName());
    return tx.execute(
        s -> {
          var current = locked(req, true);
          db.renameUser((String) current.get("userId"), n);
          return identity.require(req);
        });
  }

  Map<String, Object> password(
      HttpServletRequest req, HttpServletResponse res, ChangePassword body) {
    String old = passwordValue(body.currentPassword()), next = passwordValue(body.newPassword());
    var encoded = passwords.encode(next);
    var issued =
        tx.execute(
            s -> {
              var current = locked(req, true);
              String id = (String) current.get("userId");
              if (!passwords.verify(old, db.credentialsByUser(id)))
                throw Problem.invalid("当前密码不正确");
              db.replacePassword(
                  id, encoded.algorithm(), encoded.iterations(), encoded.salt(), encoded.hash());
              db.revokeUserSessions(id);
              return identity.issue(id);
            });
    identity.cookie(res, issued.token());
    return issued.session();
  }

  private static Problem invalid() {
    return new Problem(401, "AUTH_INVALID", "账号或密码不正确");
  }
}
