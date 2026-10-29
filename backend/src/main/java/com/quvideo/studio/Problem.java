package com.quvideo.studio;

public class Problem extends RuntimeException {
  final int status;
  final String code;

  public Problem(int status, String code, String message) {
    super(message);
    this.status = status;
    this.code = code;
  }

  static Problem missing() {
    return new Problem(404, "NOT_FOUND", "记录不存在或不属于当前用户");
  }

  static Problem invalid(String message) {
    return new Problem(400, "INVALID_ARGUMENT", message);
  }
}
