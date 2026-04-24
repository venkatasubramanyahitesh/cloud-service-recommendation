package com.hospital.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    public String getRecommendation(String input) {

        try {
            String prompt = "Suggest AWS services as comma separated list only. Input: " + input;

            String body = """
            {
              "contents": [{
                "parts": [{
                  "text": "%s"
                }]
              }]
            }
            """.formatted(prompt);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + apiKey
                    ))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            String result = response.body();
            System.out.println("✅ Gemini Response: " + result);

            return extractText(result);

        } catch (Exception e) {
            System.out.println("❌ Gemini Error: " + e.getMessage());
            return fallback(input);
        }
    }

    private String extractText(String raw) {
        try {
            int start = raw.indexOf("\"text\": \"");
            if (start == -1) return raw;

            start += 9;
            int end = raw.indexOf("\"", start);

            return raw.substring(start, end);
        } catch (Exception e) {
            return raw;
        }
    }

    private String fallback(String input) {
        return "EC2, S3, RDS, CloudFront";
    }
}