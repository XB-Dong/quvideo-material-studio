package com.quvideo.studio;
import java.io.*;
import java.time.*;
import java.util.*;
import jakarta.servlet.http.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
@RestController
public class Api {
 private final Db db;private final Identity identity;private final FilesService files;private final Tasks tasks;
 public Api(Db db,Identity identity,FilesService files,Tasks tasks){this.db=db;this.identity=identity;this.files=files;this.tasks=tasks;}
 static LocalDateTime local(Object value){if(value instanceof LocalDateTime d)return d;if(value instanceof java.sql.Timestamp t)return t.toLocalDateTime();throw new IllegalStateException("Unexpected date type");}
 static void times(Map<String,Object> map){for(String k:List.of("expiresAt","createdAt","updatedAt","startedAt","completedAt")){Object v=map.get(k);if(v!=null)map.put(k,local(v).toInstant(ZoneOffset.UTC).toString());}}
 String user(HttpServletRequest req){return (String)identity.require(req).get("userId");}
 @PostMapping("/api/session")public Map<String,Object> ensure(HttpServletRequest req,HttpServletResponse res){var s=identity.ensure(req,res);times(s);return s;}
 @GetMapping("/api/session")public Map<String,Object> session(HttpServletRequest req){var s=identity.require(req);times(s);return s;}
 @GetMapping("/api/categories")public List<Map<String,Object>> categories(){return db.categories();}
 Map<String,Object> templateView(Map<String,Object> t){if(t==null)throw Problem.missing();t.put("coverUrl","/media/demo/"+t.remove("coverKey"));t.remove("resultKey");t.put("acceptedMimeTypes",List.of("image/jpeg","image/png"));return t;}
 @GetMapping("/api/templates")public List<Map<String,Object>> templates(@RequestParam(required=false)String categoryId){return db.templates(categoryId).stream().map(this::templateView).toList();}
 @GetMapping("/api/templates/{id}")public Map<String,Object> template(@PathVariable String id){return templateView(db.template(id));}
 @PostMapping("/api/assets")@ResponseStatus(HttpStatus.CREATED)public Map<String,Object> asset(HttpServletRequest req,@RequestParam String templateId,@RequestParam MultipartFile file)throws IOException{return files.upload(user(req),templateId,file);}
 @PostMapping("/api/tasks")@ResponseStatus(HttpStatus.ACCEPTED)public Map<String,Object> create(HttpServletRequest req,@RequestBody Tasks.Create body){return tasks.create(user(req),body);}
 @GetMapping("/api/tasks")public Map<String,Object> history(HttpServletRequest req,@RequestParam(defaultValue="false")boolean activeOnly,@RequestParam(required=false)String cursor,@RequestParam(defaultValue="20")int limit){return tasks.history(user(req),activeOnly,cursor,limit);}
 @GetMapping("/api/tasks/{id}")public Map<String,Object> task(HttpServletRequest req,@PathVariable String id){return tasks.get(user(req),id);}
 ResponseEntity<byte[]> image(byte[] bytes,String mime){return ResponseEntity.ok().contentType(MediaType.parseMediaType(mime)).header("X-Content-Type-Options","nosniff").body(bytes);}
 @GetMapping("/media/demo/{key}")public ResponseEntity<byte[]> demo(@PathVariable String key)throws IOException{return image(files.demo(key),"image/png");}
 @GetMapping("/media/assets/{id}")public ResponseEntity<byte[]> assetImage(HttpServletRequest req,@PathVariable String id)throws IOException{var asset=db.assetByOwner(id,user(req));if(asset==null)throw Problem.missing();return image(files.read((String)asset.get("storageKey")),(String)asset.get("mimeType"));}
 @GetMapping("/media/results/{id}")public ResponseEntity<byte[]> result(HttpServletRequest req,@PathVariable String id)throws IOException{var task=db.taskOwned(id,user(req));if(task==null||!"SUCCEEDED".equals(task.get("status")))throw Problem.missing();return image(files.read((String)task.get("resultKey")),"image/png");}
}
