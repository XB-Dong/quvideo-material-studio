package com.quvideo.studio;

import jakarta.servlet.http.*;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
public class AccountApi {
  private final AccountService accounts;

  public AccountApi(AccountService accounts) {
    this.accounts = accounts;
  }

  private Map<String, Object> view(Map<String, Object> session) {
    Api.times(session);
    return session;
  }

  @PostMapping("/api/auth/register")
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> register(
      HttpServletRequest req, HttpServletResponse res, @RequestBody AccountService.Register body) {
    return view(accounts.register(req, res, body));
  }

  @PostMapping("/api/auth/login")
  public Map<String, Object> login(
      HttpServletRequest req, HttpServletResponse res, @RequestBody AccountService.Login body) {
    return view(accounts.login(req, res, body));
  }

  @PostMapping("/api/auth/logout")
  public Map<String, Object> logout(HttpServletRequest req, HttpServletResponse res) {
    return view(accounts.logout(req, res));
  }

  @PatchMapping("/api/account/profile")
  public Map<String, Object> profile(
      HttpServletRequest req, @RequestBody AccountService.Profile body) {
    return view(accounts.profile(req, body));
  }

  @PostMapping("/api/account/password")
  public Map<String, Object> password(
      HttpServletRequest req,
      HttpServletResponse res,
      @RequestBody AccountService.ChangePassword body) {
    return view(accounts.password(req, res, body));
  }
}
