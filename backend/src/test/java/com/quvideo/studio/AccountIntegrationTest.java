package com.quvideo.studio;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import java.util.*;
import java.util.concurrent.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.*;
import org.springframework.test.web.servlet.*;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.transaction.support.TransactionTemplate;

@SpringBootTest(
    properties = {
      "STORAGE_ROOT=/tmp/material-account-tests",
      "SIMULATION_ASSET_CHECK_DELAY_MS=0",
      "SIMULATION_GENERATE_DELAY_MS=0",
      "SIMULATION_FINALIZE_DELAY_MS=0"
    })
@AutoConfigureMockMvc
class AccountIntegrationTest {
  @Autowired MockMvc mvc;
  @Autowired ObjectMapper json;
  @Autowired Identity identity;
  @Autowired Db db;
  @Autowired Tasks tasks;
  @Autowired FilesService files;
  @Autowired AccountService accounts;
  @Autowired TransactionTemplate tx;
  static final String PASSWORD = "Test-password-2026!";
  static final String NEXT = "Changed-password-2026!";

  String email() {
    return UUID.randomUUID() + "@example.test";
  }

  MvcResult call(MockHttpServletRequestBuilder b, Cookie c, Object body, int status)
      throws Exception {
    b.header("Origin", "http://localhost:3000");
    if (c != null) b.cookie(c);
    if (body != null) b.contentType("application/json").content(json.writeValueAsBytes(body));
    var result = mvc.perform(b).andReturn();
    assertEquals(
        status, result.getResponse().getStatus(), result.getResponse().getContentAsString());
    return result;
  }

  Map<String, Object> body(MvcResult r) throws Exception {
    return json.readValue(r.getResponse().getContentAsByteArray(), Map.class);
  }

  Cookie cookie(MvcResult r) {
    String value = r.getResponse().getHeader("Set-Cookie");
    assertNotNull(value);
    assertTrue(value.contains("HttpOnly"));
    assertTrue(value.contains("SameSite=Lax"));
    return new Cookie("material_session", value.split(";", 2)[0].split("=", 2)[1]);
  }

  Cookie guest() throws Exception {
    return cookie(call(post("/api/session"), null, null, 200));
  }

  Map<String, Object> register(String email) {
    return Map.of("email", email, "displayName", "用户", "password", PASSWORD);
  }

  @Test
  void fullLifecyclePreservesGuestWorkAndRevokesSessions() throws Exception {
    Cookie g = guest();
    String id = (String) body(call(get("/api/session"), g, null, 200)).get("userId");
    String asset =
        (String)
            files
                .upload(
                    id,
                    "demo-pet",
                    new MockMultipartFile("file", "p.png", "image/png", files.demo("pet.png")))
                .get("id");
    String task =
        (String) tasks.create(id, new Tasks.Create("demo-pet", List.of(asset), null)).get("id");
    String e = email();
    var registered = call(post("/api/auth/register"), g, register(e), 201);
    Cookie a = cookie(registered);
    var session = body(registered);
    assertEquals(id, session.get("userId"));
    assertEquals("ACCOUNT", session.get("kind"));
    assertEquals(false, session.get("emailVerified"));
    assertEquals(
        Set.of("userId", "displayName", "expiresAt", "kind", "email", "emailVerified"),
        session.keySet());
    call(get("/api/session"), g, null, 401);
    call(get("/api/tasks/" + task), a, null, 200);
    call(get("/media/assets/" + asset), a, null, 200);
    call(patch("/api/account/profile"), a, Map.of("displayName", "新昵称"), 200);
    assertEquals("新昵称", body(call(get("/api/session"), a, null, 200)).get("displayName"));
    Cookie loggedOut = cookie(call(post("/api/auth/logout"), a, null, 200));
    call(get("/api/session"), a, null, 401);
    call(get("/api/tasks/" + task), loggedOut, null, 404);
    call(get("/media/assets/" + asset), loggedOut, null, 404);
    call(patch("/api/account/profile"), loggedOut, Map.of("displayName", "x"), 403);
    Cookie login =
        cookie(
            call(
                post("/api/auth/login"),
                loggedOut,
                Map.of("email", e.toUpperCase(Locale.ROOT), "password", PASSWORD),
                200));
    call(get("/api/session"), loggedOut, null, 401);
    Cookie device =
        cookie(call(post("/api/auth/login"), null, Map.of("email", e, "password", PASSWORD), 200));
    call(
        post("/api/account/password"),
        login,
        Map.of("currentPassword", "Wrong-password-2026!", "newPassword", NEXT),
        400);
    Cookie changed =
        cookie(
            call(
                post("/api/account/password"),
                login,
                Map.of("currentPassword", PASSWORD, "newPassword", NEXT),
                200));
    call(get("/api/session"), login, null, 401);
    call(get("/api/session"), device, null, 401);
    call(post("/api/auth/login"), null, Map.of("email", e, "password", PASSWORD), 401);
    call(post("/api/auth/login"), null, Map.of("email", e, "password", NEXT), 200);
    call(get("/api/tasks/" + task), changed, null, 200);
    long until = System.nanoTime() + TimeUnit.SECONDS.toNanos(10);
    while (!"SUCCEEDED".equals(db.taskById(task).get("status")) && System.nanoTime() < until)
      Thread.sleep(20);
    call(get("/media/results/" + task), changed, null, 200);
    call(get("/media/results/" + task), guest(), null, 404);
  }

  @Test
  void validationConflictAndFailedLoginPreserveExistingIdentity() throws Exception {
    Cookie g = guest();
    String e = email();
    call(
        post("/api/auth/register"),
        g,
        Map.of("email", "invalid", "password", PASSWORD, "displayName", "name"),
        400);
    call(
        post("/api/auth/register"),
        g,
        Map.of("email", e, "password", "short", "displayName", "name"),
        400);
    Cookie account =
        cookie(
            call(
                post("/api/auth/register"),
                g,
                register("  " + e.toUpperCase(Locale.ROOT) + "  "),
                201));
    call(post("/api/auth/register"), account, register(email()), 409);
    Cookie other = guest();
    String user = (String) body(call(get("/api/session"), other, null, 200)).get("userId");
    call(post("/api/auth/register"), other, register(e), 409);
    assertNull(db.credentialsByUser(user));
    var invalid =
        call(
            post("/api/auth/login"),
            other,
            Map.of("email", e, "password", "Wrong-password-2026!"),
            401);
    assertEquals("AUTH_INVALID", body(invalid).get("code"));
    call(get("/api/session"), other, null, 200);
    call(post("/api/auth/login"), null, Map.of("email", email(), "password", PASSWORD), 401);
    for (int i = 0; i < 5; i++)
      call(
          post("/api/auth/login"),
          null,
          Map.of("email", e, "password", "Wrong-password-2026!"),
          i == 4 ? 429 : 401);
    call(
        post("/api/account/password"),
        account,
        Map.of("currentPassword", PASSWORD, "newPassword", "short"),
        400);
    call(patch("/api/account/profile"), account, Map.of("displayName", " "), 400);
    var forbidden =
        mvc.perform(
                post("/api/auth/logout").cookie(account).header("Origin", "https://other.example"))
            .andReturn();
    assertEquals(403, forbidden.getResponse().getStatus());
  }

  @Test
  void duplicateEmailIsAtomicUnderConcurrentRegistration() throws Exception {
    Cookie a = guest(), b = guest();
    String e = email();
    ExecutorService pool = Executors.newFixedThreadPool(2);
    try {
      var futures =
          pool.invokeAll(
              List.of(
                  () ->
                      mvc.perform(
                              post("/api/auth/register")
                                  .cookie(a)
                                  .contentType("application/json")
                                  .content(json.writeValueAsBytes(register(e))))
                          .andReturn()
                          .getResponse()
                          .getStatus(),
                  () ->
                      mvc.perform(
                              post("/api/auth/register")
                                  .cookie(b)
                                  .contentType("application/json")
                                  .content(json.writeValueAsBytes(register(e))))
                          .andReturn()
                          .getResponse()
                          .getStatus()));
      var statuses =
          futures.stream()
              .map(
                  f -> {
                    try {
                      return f.get();
                    } catch (Exception ex) {
                      throw new RuntimeException(ex);
                    }
                  })
              .sorted()
              .toList();
      assertEquals(List.of(201, 409), statuses);
    } finally {
      pool.shutdownNow();
    }
  }

  @Test
  void concurrentGuestUpgradeRechecksIdentityAfterUserLock() throws Exception {
    Cookie guest = guest();
    String firstEmail = email(), secondEmail = email();
    ExecutorService pool = Executors.newFixedThreadPool(2);
    try {
      var results =
          pool.<MvcResult>invokeAll(
              List.of(
                  () ->
                      mvc.perform(
                              post("/api/auth/register")
                                  .cookie(guest)
                                  .contentType("application/json")
                                  .content(json.writeValueAsBytes(register(firstEmail))))
                          .andReturn(),
                  () ->
                      mvc.perform(
                              post("/api/auth/register")
                                  .cookie(guest)
                                  .contentType("application/json")
                                  .content(json.writeValueAsBytes(register(secondEmail))))
                          .andReturn()));
      int succeeded = 0, conflicted = 0;
      for (var future : results) {
        var result = future.get();
        if (result.getResponse().getStatus() == 201) succeeded++;
        else {
          assertEquals(401, result.getResponse().getStatus());
          assertEquals("UNAUTHENTICATED", body(result).get("code"));
          conflicted++;
        }
      }
      assertEquals(1, succeeded);
      assertEquals(1, conflicted);
      assertNotEquals(
          db.credentialsByEmail(firstEmail) == null, db.credentialsByEmail(secondEmail) == null);
    } finally {
      pool.shutdownNow();
    }
  }

  @Test
  void logoutWithoutLiveCookieStillReturnsFreshGuest() throws Exception {
    Cookie unknown = new Cookie("material_session", "synthetic-unknown-token");
    Cookie next = cookie(call(post("/api/auth/logout"), unknown, null, 200));
    assertEquals("GUEST", body(call(get("/api/session"), next, null, 200)).get("kind"));
    assertEquals("GUEST", body(call(post("/api/auth/logout"), null, null, 200)).get("kind"));
  }

  @Test
  void databaseRollbackRestoresGuestAndCredentials() throws Exception {
    Cookie g = guest();
    var request = new MockHttpServletRequest();
    request.setCookies(g);
    String id = (String) identity.require(request).get("userId");
    String e = email();
    assertThrows(
        IllegalStateException.class,
        () ->
            tx.executeWithoutResult(
                s -> {
                  accounts.register(
                      request,
                      new MockHttpServletResponse(),
                      new AccountService.Register("变更", e, PASSWORD));
                  throw new IllegalStateException("rollback injection");
                }));
    assertNull(db.credentialsByEmail(e));
    assertEquals("GUEST", identity.require(request).get("kind"));
    assertEquals(id, identity.require(request).get("userId"));
  }
}
