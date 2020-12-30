import React from 'react';
import {
    Switch,
    Route,
    withRouter,
    useRouteMatch,
    useParams
} from "react-router-dom";
import Cabang from './page-content/Cabang';
import Slot from './page-content/Slot';
import TestName from './page-content/TestName';

function PostType(props) {
    let match = useRouteMatch();
    let { postType } = useParams();
    if (postType === 'cabang') {
        return (
            <Switch>
                <Route path={match.path}>
                    <Cabang detail_login={props.detail_login} />
                </Route>
            </Switch>
        );
    } else if (postType === 'slot') {
        return (
            <Switch>
                <Route path={match.path}>
                    <Slot detail_login={props.detail_login} />
                </Route>
            </Switch>
        );
    } else if (postType === 'test-name') {
        return (
            <Switch>
                <Route path={match.path}>
                    <TestName detail_login={props.detail_login} />
                </Route>
            </Switch>
        );
    } else {
        return <h3>Not Found</h3>;
    }
}

export default withRouter(PostType);