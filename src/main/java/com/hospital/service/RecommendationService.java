package com.hospital.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class RecommendationService {

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private CostService costService;

    public Map<String, Object> getRecommendation(String input) {

        String response = geminiService.getRecommendation(input);

        List<String> awsServices = parseServices(response);

        return costService.process(awsServices);
    }

    private List<String> parseServices(String text) {

        text = text.replace("Amazon ", "");

        String[] parts = text.split(",");

        List<String> list = new ArrayList<>();

        for (String s : parts) {
            list.add(s.trim());
        }

        return list;
    }
}