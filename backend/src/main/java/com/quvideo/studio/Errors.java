package com.quvideo.studio;

import jakarta.servlet.http.HttpServletRequest;
import java.util.*;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

@RestControllerAdvice
public class Errors {
  @ExceptionHandler(Problem.class)
  ResponseEntity<?> problem(Problem e, HttpServletRequest req) {
    return response(e.status, e.code, e.getMessage(), req);
  }

  @ExceptionHandler(MaxUploadSizeExceededException.class)
  ResponseEntity<?> size(Exception e, HttpServletRequest req) {
    return response(413, "FILE_TOO_LARGE", "图片超过 5 MiB 限制", req);
  }

  @ExceptionHandler({
    HttpMessageNotReadableException.class,
    MissingServletRequestParameterException.class,
    MethodArgumentTypeMismatchException.class,
    MissingServletRequestPartException.class
  })
  ResponseEntity<?> invalid(Exception e, HttpServletRequest req) {
    return response(400, "INVALID_ARGUMENT", "请求参数不正确，请检查后重试", req);
  }

  @ExceptionHandler(Exception.class)
  ResponseEntity<?> other(Exception e, HttpServletRequest req) {
    org.slf4j.LoggerFactory.getLogger(Errors.class)
        .error("Request failed {}", req.getAttribute("requestId"), e);
    return response(500, "INTERNAL_ERROR", "服务暂时不可用，请稍后重试", req);
  }

  private ResponseEntity<?> response(
      int status, String code, String message, HttpServletRequest req) {
    return ResponseEntity.status(status)
        .body(
            Map.of(
                "code",
                code,
                "message",
                message,
                "requestId",
                String.valueOf(req.getAttribute("requestId"))));
  }
}
