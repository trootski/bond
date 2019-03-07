package org.troot.BondSpring;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MovieController {

    @RequestMapping("/")
    public BondMovie getDefaultDoc() {
        return new BondMovie();
    }
}
