package org.troot.simulations

import io.gatling.core.Predef._
import io.gatling.core.scenario.Scenario
import io.gatling.http.Predef._
import org.troot.scenarios.GetMyPlans
import org.troot.utils.SimulationTraits

import scala.concurrent.duration._

class OMDBCacheSimulation extends Simulation with SimulationTraits {

  val scn = scenario("Load My Plans")
    .exec(GetMyPlans.scenario)

  setUp(scn)
}
