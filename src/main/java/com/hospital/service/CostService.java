package com.hospital.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CostService {

    private final Map<String, Map<String, String>> serviceMapping = Map.of(
            "EC2", Map.of("azure", "Virtual Machines", "gcp", "Compute Engine"),
            "S3", Map.of("azure", "Blob Storage", "gcp", "Cloud Storage"),
            "RDS", Map.of("azure", "SQL Database", "gcp", "Cloud SQL"),
            "Lambda", Map.of("azure", "Functions", "gcp", "Cloud Functions"),
            "DynamoDB", Map.of("azure", "Cosmos DB", "gcp", "Firestore"),
            "CloudFront", Map.of("azure", "CDN", "gcp", "Cloud CDN"),
            "API Gateway", Map.of("azure", "API Management", "gcp", "API Gateway")
    );

    private final Map<String, Double> awsPrices = Map.of(
            "EC2", 8.0,
            "S3", 0.23,
            "RDS", 15.0,
            "Lambda", 2.0,
            "DynamoDB", 5.0,
            "CloudFront", 3.0,
            "API Gateway", 3.5
    );

    private final Map<String, Double> azurePrices = Map.of(
            "Virtual Machines", 9.0,
            "Blob Storage", 0.20,
            "SQL Database", 16.0,
            "Functions", 2.2,
            "Cosmos DB", 6.0,
            "CDN", 3.5,
            "API Management", 4.0
    );

    private final Map<String, Double> gcpPrices = Map.of(
            "Compute Engine", 7.0,
            "Cloud Storage", 0.26,
            "Cloud SQL", 14.0,
            "Cloud Functions", 2.1,
            "Firestore", 5.5,
            "Cloud CDN", 3.2,
            "API Gateway", 3.3
    );

    public Map<String, Object> process(List<String> awsServices) {

        List<String> azure = new ArrayList<>();
        List<String> gcp = new ArrayList<>();

        for (String service : awsServices) {
            if (serviceMapping.containsKey(service)) {
                azure.add(serviceMapping.get(service).get("azure"));
                gcp.add(serviceMapping.get(service).get("gcp"));
            }
        }

        double awsTotal = Math.round(
                awsServices.stream()
                        .mapToDouble(s -> awsPrices.getOrDefault(s, 0.0))
                        .sum() * 100.0
        ) / 100.0;

        double azureTotal = Math.round(
                azure.stream()
                        .mapToDouble(s -> azurePrices.getOrDefault(s, 0.0))
                        .sum() * 100.0
        ) / 100.0;

        double gcpTotal = Math.round(
                gcp.stream()
                        .mapToDouble(s -> gcpPrices.getOrDefault(s, 0.0))
                        .sum() * 100.0
        ) / 100.0;

        String best = "AWS";
        double min = awsTotal;

        if (azureTotal < min) {
            min = azureTotal;
            best = "Azure";
        }
        if (gcpTotal < min) {
            best = "GCP";
        }

        return Map.of(
                "aws", awsServices,
                "azure", azure,
                "gcp", gcp,
                "cost", Map.of(
                        "aws", awsTotal,
                        "azure", azureTotal,
                        "gcp", gcpTotal
                ),
                "best", best
        );
    }
}