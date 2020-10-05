package org.troot.scenarios

import com.typesafe.scalalogging.StrictLogging
import io.gatling.core.Predef._
import io.gatling.http.Predef._

object GetMyPlans extends StrictLogging{

  val baseURL = "https://planner-api.staging0.hmheng-csl.br.internal"
  val method = "/"
  val body = "{}"

  def scenario = exec(
    http("GetMovieFromOMDB")
      .post(s"${baseURL}/${method}")
      .headers(Map(
        "Authorization" -> "dummyToken"
      ))
  )
}
