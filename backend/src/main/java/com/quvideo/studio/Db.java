package com.quvideo.studio;

import java.util.*;
import org.apache.ibatis.annotations.*;

@Mapper
public interface Db {
  String TASK =
      "SELECT id,user_id AS userId,template_id AS templateId,template_title AS"
          + " templateTitle,status,stage,failed_stage AS failedStage,failure_code AS"
          + " failureCode,failure_reason AS failureReason,result_key AS"
          + " resultKey,version,simulation_json AS simulationJson,created_at AS"
          + " createdAt,started_at AS startedAt,completed_at AS completedAt,updated_at AS updatedAt"
          + " FROM tasks";

  @Select("SELECT id,title FROM categories ORDER BY sort_order")
  List<Map<String, Object>> categories();

  @Select(
      "<script>SELECT id,category_id AS categoryId,title,description,cover_key AS"
          + " coverKey,result_key AS resultKey,required_image_count AS"
          + " requiredImageCount,max_file_size_bytes AS maxFileSizeBytes FROM templates <if"
          + " test='category != null'>WHERE category_id=#{category}</if> ORDER BY"
          + " sort_order</script>")
  List<Map<String, Object>> templates(@Param("category") String category);

  @Select(
      "SELECT id,category_id AS categoryId,title,description,cover_key AS coverKey,result_key AS"
          + " resultKey,required_image_count AS requiredImageCount,max_file_size_bytes AS"
          + " maxFileSizeBytes FROM templates WHERE id=#{id}")
  Map<String, Object> template(String id);

  @Insert("INSERT INTO users VALUES(#{id},#{name},UTC_TIMESTAMP(6))")
  void user(@Param("id") String id, @Param("name") String name);

  @Insert("INSERT INTO sessions VALUES(#{hash},#{user},#{expires})")
  void session(
      @Param("hash") String hash,
      @Param("user") String user,
      @Param("expires") java.time.LocalDateTime expires);

  @Select(
      "SELECT u.id AS userId,u.display_name AS displayName,s.expires_at AS expiresAt, a.email FROM"
          + " sessions s JOIN users u ON u.id=s.user_id LEFT JOIN account_credentials a ON"
          + " a.user_id=u.id WHERE s.token_hash=#{hash} AND s.expires_at>UTC_TIMESTAMP(6)")
  Map<String, Object> sessionByHash(String hash);

  @Select("SELECT id FROM users WHERE id=#{id} FOR UPDATE")
  @Options(flushCache = Options.FlushCachePolicy.TRUE)
  String lockUser(String id);

  @Update("UPDATE users SET display_name=#{name} WHERE id=#{id}")
  void renameUser(@Param("id") String id, @Param("name") String name);

  @Delete("DELETE FROM sessions WHERE token_hash=#{hash}")
  void revokeSession(String hash);

  @Delete("DELETE FROM sessions WHERE user_id=#{id}")
  void revokeUserSessions(String id);

  String CREDENTIAL =
      "SELECT user_id AS userId,email,password_algorithm AS algorithm,iterations,salt,password_hash"
          + " AS passwordHash FROM account_credentials";

  @Select(CREDENTIAL + " WHERE email=#{email}")
  Map<String, Object> credentialsByEmail(String email);

  @Select(CREDENTIAL + " WHERE user_id=#{id}")
  Map<String, Object> credentialsByUser(String id);

  @Insert(
      "INSERT INTO account_credentials"
          + " VALUES(#{user},#{email},#{algorithm},#{iterations},#{salt},#{hash},UTC_TIMESTAMP(6))")
  void credentials(
      @Param("user") String user,
      @Param("email") String email,
      @Param("algorithm") String algorithm,
      @Param("iterations") int iterations,
      @Param("salt") String salt,
      @Param("hash") String hash);

  @Update(
      "UPDATE account_credentials SET"
          + " password_algorithm=#{algorithm},iterations=#{iterations},salt=#{salt},password_hash=#{hash},updated_at=UTC_TIMESTAMP(6)"
          + " WHERE user_id=#{user}")
  void replacePassword(
      @Param("user") String user,
      @Param("algorithm") String algorithm,
      @Param("iterations") int iterations,
      @Param("salt") String salt,
      @Param("hash") String hash);

  @Insert(
      "INSERT INTO assets"
          + " VALUES(#{id},#{userId},#{storageKey},#{originalName},#{mimeType},#{sizeBytes},#{width},#{height},UTC_TIMESTAMP(6))")
  void asset(Map<String, Object> asset);

  @Select(
      "SELECT id,user_id AS userId,storage_key AS storageKey,mime_type AS mimeType,size_bytes AS"
          + " sizeBytes,width,height FROM assets WHERE id=#{id} AND user_id=#{user}")
  Map<String, Object> assetByOwner(@Param("id") String id, @Param("user") String user);

  @Insert(
      "INSERT INTO"
          + " tasks(id,user_id,template_id,template_title,status,simulation_json,created_at,updated_at)"
          + " VALUES(#{id},#{user},#{template},#{title},'QUEUED',#{simulation},UTC_TIMESTAMP(6),UTC_TIMESTAMP(6))")
  void task(
      @Param("id") String id,
      @Param("user") String user,
      @Param("template") String template,
      @Param("title") String title,
      @Param("simulation") String simulation);

  @Insert("INSERT INTO task_assets VALUES(#{task},#{asset},#{slot})")
  void link(@Param("task") String task, @Param("asset") String asset, @Param("slot") int slot);

  @Insert("INSERT INTO task_steps(task_id,stage,status) VALUES(#{task},#{stage},'NOT_STARTED')")
  void step(@Param("task") String task, @Param("stage") String stage);

  @Select(TASK + " WHERE id=#{id}")
  Map<String, Object> taskById(String id);

  @Select(TASK + " WHERE id=#{id} AND user_id=#{user}")
  Map<String, Object> taskOwned(@Param("id") String id, @Param("user") String user);

  @Select(
      "<script>"
          + TASK
          + " WHERE user_id=#{user} <if test='active'>AND status IN ('QUEUED','RUNNING')</if> <if"
          + " test='beforeTime != null'>AND (created_at &lt; #{beforeTime} OR"
          + " (created_at=#{beforeTime} AND id &lt; #{beforeId}))</if> ORDER BY created_at DESC,id"
          + " DESC LIMIT #{limit}</script>")
  List<Map<String, Object>> history(
      @Param("user") String user,
      @Param("active") boolean active,
      @Param("beforeTime") java.time.LocalDateTime beforeTime,
      @Param("beforeId") String beforeId,
      @Param("limit") int limit);

  @Select(
      "SELECT stage,status,started_at AS startedAt,completed_at AS completedAt,failure_reason AS"
          + " failureReason FROM task_steps WHERE task_id=#{id} ORDER BY"
          + " FIELD(stage,'ASSET_CHECK','GENERATE','FINALIZE')")
  List<Map<String, Object>> steps(String id);

  @Select(
      "SELECT a.storage_key FROM task_assets ta JOIN assets a ON a.id=ta.asset_id WHERE"
          + " ta.task_id=#{id} ORDER BY ta.slot_index")
  List<String> taskFiles(String id);

  @Update(
      "UPDATE tasks SET"
          + " status='RUNNING',stage=#{stage},started_at=COALESCE(started_at,UTC_TIMESTAMP(6)),updated_at=UTC_TIMESTAMP(6),version=version+1"
          + " WHERE id=#{id} AND ((#{stage}='ASSET_CHECK' AND status='QUEUED') OR"
          + " (#{stage}='GENERATE' AND status='RUNNING' AND stage='ASSET_CHECK') OR"
          + " (#{stage}='FINALIZE' AND status='RUNNING' AND stage='GENERATE'))")
  int beginTask(@Param("id") String id, @Param("stage") String stage);

  @Update(
      "UPDATE task_steps SET status='RUNNING',started_at=UTC_TIMESTAMP(6) WHERE task_id=#{id} AND"
          + " stage=#{stage} AND status='NOT_STARTED'")
  int beginStep(@Param("id") String id, @Param("stage") String stage);

  @Update(
      "UPDATE task_steps SET status='SUCCEEDED',completed_at=UTC_TIMESTAMP(6) WHERE task_id=#{id}"
          + " AND stage=#{stage} AND status='RUNNING'")
  int endStep(@Param("id") String id, @Param("stage") String stage);

  @Update(
      "UPDATE tasks SET updated_at=UTC_TIMESTAMP(6),version=version+1 WHERE id=#{id} AND"
          + " status='RUNNING'")
  int touch(String id);

  @Update(
      "UPDATE tasks SET"
          + " status='SUCCEEDED',result_key=#{key},completed_at=UTC_TIMESTAMP(6),updated_at=UTC_TIMESTAMP(6),version=version+1"
          + " WHERE id=#{id} AND status='RUNNING' AND stage='FINALIZE'")
  int success(@Param("id") String id, @Param("key") String key);

  @Update(
      "UPDATE tasks SET"
          + " status='FAILED',failed_stage=stage,failure_code=#{code},failure_reason=#{reason},completed_at=UTC_TIMESTAMP(6),updated_at=UTC_TIMESTAMP(6),version=version+1"
          + " WHERE id=#{id} AND status IN ('QUEUED','RUNNING')")
  int fail(@Param("id") String id, @Param("code") String code, @Param("reason") String reason);

  @Update(
      "UPDATE task_steps SET status='FAILED',failure_reason=#{reason},completed_at=UTC_TIMESTAMP(6)"
          + " WHERE task_id=#{id} AND status='RUNNING'")
  int failStep(@Param("id") String id, @Param("reason") String reason);

  @Select("SELECT id FROM tasks WHERE status IN ('QUEUED','RUNNING')")
  List<String> unfinished();
}
