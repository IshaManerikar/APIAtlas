
package com.apiatlas.dto;

import java.util.List;

public class CollectionRequest {

    private String name;
    private String description;
    private List<Long> endpointIds;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Long> getEndpointIds() {
        return endpointIds;
    }

    public void setEndpointIds(List<Long> endpointIds) {
        this.endpointIds = endpointIds;
    }
}
