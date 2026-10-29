package com.quvideo.studio;
import java.io.IOException;
import java.util.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
@Component
public class RequestFilter extends OncePerRequestFilter {
 private final String origin;private final ObjectMapper json;
 public RequestFilter(@Value("${APP_PUBLIC_ORIGIN:http://localhost:3000}")String origin,ObjectMapper json){this.origin=origin;this.json=json;}
 protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{
  String requestId=UUID.randomUUID().toString();req.setAttribute("requestId",requestId);res.setHeader("X-Request-Id",requestId);res.setHeader("X-Content-Type-Options","nosniff");if(req.getRequestURI().startsWith("/api/")||req.getRequestURI().startsWith("/media/assets/")||req.getRequestURI().startsWith("/media/results/"))res.setHeader("Cache-Control","no-store");
  String supplied=req.getHeader("Origin");if(!Set.of("GET","HEAD","OPTIONS").contains(req.getMethod())&&supplied!=null&&!origin.equals(supplied)){res.setStatus(403);res.setContentType("application/json;charset=UTF-8");json.writeValue(res.getOutputStream(),Map.of("code","ORIGIN_FORBIDDEN","message","请求来源不被允许","requestId",requestId));return;}chain.doFilter(req,res);
 }
}
