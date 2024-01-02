import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "./layout/Layout";

/**
 * Defines the root application component.
 * @returns {JSX.Element}
 */
function App() {
  const [userTimeZone, setUserTimeZone] = useState("UTC");

  function getUserTimeZone() {
    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return userTimeZone || "UTC";
    } catch (error) {
      console.error("Error getting user timezone:", error);
      return "UTC";
    }
  }

  useEffect(() => {
    const fetchUserTimeZone = async () => {
      try {
        const timeZone = await getUserTimeZone();
        setUserTimeZone(timeZone);
        console.log(timeZone)
      } catch (error) {
        console.error("Error fetching user timezone:", error);
      }
    };
    fetchUserTimeZone();
  }, []);

  return (
    <Switch>
      <Route path="/">
        <Layout timeZone={userTimeZone} />
      </Route>
    </Switch>
  );
}

export default App;
