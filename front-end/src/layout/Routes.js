import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NewReservation from "../newReservation/NewReservation";
import NewTable from "../newTable/NewTable";
import EditReservation from "../editReservation/EditReservation";
import SeatReservation from "../seatReservation/SeatReservation";
import Search from "../search/Search";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes({ timeZone }) {
  const query = useQuery();
  const date = query.get("date");
  return (
    <div className="container mt-3">
      <Switch>
        <Route exact={true} path="/">
          <Redirect to={"/dashboard"} />
        </Route>
        <Route exact={true} path="/reservations">
          <Redirect to={"/dashboard"} />
        </Route>
        <Route path="/dashboard">
          <Dashboard date={date || today()} />
        </Route>
        <Route path="/reservations/new">
          <NewReservation timeZone={timeZone} />
        </Route>
        <Route path="/reservations/:reservationId/edit">
          <EditReservation timeZone={timeZone} />
        </Route>
        <Route path="/reservations/:reservationId/seat">
          <SeatReservation />
        </Route>
        <Route path="/tables/new">
          <NewTable />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
}

export default Routes;
