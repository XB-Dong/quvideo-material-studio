package com.quvideo.studio;
import java.security.*;
import java.time.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;
import jakarta.servlet.http.*;
@Service
public class Identity {
 private final Db db; private final TransactionTemplate tx;
 private final SecureRandom random=new SecureRandom();
 @Value("${SESSION_TTL_DAYS:7}") private int days;
 @Value("${SESSION_COOKIE_SECURE:false}") private boolean secure;
 public Identity(Db db,TransactionTemplate tx){this.db=db;this.tx=tx;}
 static String hash(String s){try{return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(s.getBytes(java.nio.charset.StandardCharsets.UTF_8)));}catch(NoSuchAlgorithmException e){throw new IllegalStateException(e);}}
 Map<String,Object> find(HttpServletRequest req){if(req.getCookies()!=null)for(Cookie c:req.getCookies())if(c.getName().equals("material_session"))return db.sessionByHash(hash(c.getValue()));return null;}
 Map<String,Object> require(HttpServletRequest req){var found=find(req);if(found==null)throw new Problem(401,"UNAUTHENTICATED","身份已失效，请重新连接");return found;}
 Map<String,Object> ensure(HttpServletRequest req,HttpServletResponse res){var current=find(req);if(current!=null)return current;byte[] bytes=new byte[32];random.nextBytes(bytes);String token=Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);String id=UUID.randomUUID().toString();String name="创作者 "+id.substring(0,6);LocalDateTime expiry=LocalDateTime.now(ZoneOffset.UTC).plusDays(days);tx.executeWithoutResult(s->{db.user(id,name);db.session(hash(token),id,expiry);});res.addHeader("Set-Cookie",org.springframework.http.ResponseCookie.from("material_session",token).httpOnly(true).secure(secure).sameSite("Lax").path("/").maxAge(Duration.ofDays(days)).build().toString());var session=new HashMap<String,Object>();session.put("userId",id);session.put("displayName",name);session.put("expiresAt",expiry);return session;}
}
