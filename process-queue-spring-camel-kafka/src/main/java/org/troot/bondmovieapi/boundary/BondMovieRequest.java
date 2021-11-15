package org.troot.bondmovieapi.boundary;


public class BondMovieRequest {

    private Integer order;
    private String review;
    private String title;

    public Integer getOrder() {
        return order;
    }
    public void setOrder(Integer order) {
        this.order = order;
    }

    public String getReview() {
        return review;
    }
    public void setReview(String review) {
        this.review = review;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String toString() {
        return "Order: " + this.order + ", Review: " + this.review + ", Title: " + this.title;
    }
}
