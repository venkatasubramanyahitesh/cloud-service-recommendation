package com.hospital.controller;

import com.hospital.model.RequestDTO;
import com.hospital.service.RecommendationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://cloud-frontend-5kqr.onrender.com"
})
public class RecommendationController {

    @Autowired
    private RecommendationService service;

    @PostMapping("/recommend")
    public ResponseEntity<Map<String, Object>> recommend(@RequestBody RequestDTO request) {

        Map<String, Object> result = service.getRecommendation(request.getProblem());
        return ResponseEntity.ok(result);
    }
}