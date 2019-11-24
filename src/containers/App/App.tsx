// Import library
import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

// Import our page to render
import { Home } from 'containers/Home';
import { DateSelect } from 'containers/DateSelect';

// Render our App
const App: React.FC = () => {
    return(
        <Router>
            <Switch>
                <Route path="/step-1">
                    <DateSelect />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </Router>
    )
}

export default App;