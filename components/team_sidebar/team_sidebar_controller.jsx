// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import {FormattedMessage} from 'react-intl';
import Permissions from 'mattermost-redux/constants/permissions';
import classNames from 'classnames';

import {filterAndSortTeamsByDisplayName} from 'utils/team_utils.jsx';

import * as Utils from 'utils/utils.jsx';

import SystemPermissionGate from 'components/permissions_gates/system_permission_gate';
import Pluggable from 'plugins/pluggable';

import TeamButton from './components/team_button.jsx';
import {useQuery} from "@apollo/react-hooks";
import {gql} from "apollo-boost";

export function renderView(props) {
    return (
        <div
            {...props}
            className='scrollbar--view'
        />);
}

export function renderThumbHorizontal(props) {
    return (
        <div
            {...props}
            className='scrollbar--horizontal'
        />);
}

export function renderThumbVertical(props) {
    return (
        <div
            {...props}
            className='scrollbar--vertical'
        />);
}

export default function TeamSidebar({
                                        myTeams,
                                        currentTeamId,
                                        moreTeamsToJoin,
                                        myTeamMembers,
                                        isOpen,
                                        experimentalPrimaryTeam,
                                        locale,
                                        actions: {
                                            getTeams,
                                            switchTeam,
                                        },
                                    }) {
    const qResult = useQuery(gql`
        query MyQuery {
            teams {
                nodes {
                    alloweddomains
                    allowopeninvite
                    companyname
                    createat
                    deleteat
                    description
                    displayname
                    email
                    groupconstrained
                    id
                    inviteid
                    name
                    updateat
                }
            }
        }


    `)
    if(qResult.loading){
        return <div>loading</div>
    }
    const root = document.querySelector('#root');
    if (myTeams.length <= 1) {
        root.classList.remove('multi-teams');
        return null;
    }
    root.classList.add('multi-teams');

    const plugins = [];
    const teams = qResult.data.teams.nodes.map((team) => {
        const member = myTeamMembers[team.id];
        return (
            <TeamButton
                key={'switch_team_' + team.name}
                url={`/${team.name}`}
                tip={team.displayname}
                active={team.id === currentTeamId}
                displayName={team.displayname}
                unread={member.msg_count > 0}
                mentions={member.mention_count}
                teamIconUrl={Utils.imageURLForTeam(team)}
                switchTeam={switchTeam}
            />
        );
    });

    if (moreTeamsToJoin && !experimentalPrimaryTeam) {
        teams.push(
            <TeamButton
                btnClass='team-btn__add'
                key='more_teams'
                url='/select_team'
                tip={
                    <FormattedMessage
                        id='team_sidebar.join'
                        defaultMessage='Other teams you can join.'
                    />
                }
                content={'+'}
                switchTeam={switchTeam}
            />
        );
    } else {
        teams.push(
            <SystemPermissionGate
                permissions={[Permissions.CREATE_TEAM]}
                key='more_teams'
            >
                <TeamButton
                    btnClass='team-btn__add'
                    url='/create_team'
                    tip={
                        <FormattedMessage
                            id='navbar_dropdown.create'
                            defaultMessage='Create a New Team'
                        />
                    }
                    content={'+'}
                    switchTeam={switchTeam}
                />
            </SystemPermissionGate>
        );
    }

    plugins.push(
        <div
            key='team-sidebar-bottom-plugin'
            className='team-sidebar-bottom-plugin is-empty'
        >
            <Pluggable pluggableName='BottomTeamSidebar'/>
        </div>
    );

    return (
        <div className={classNames('team-sidebar', {'move--right': isOpen})}>
            <div
                className='team-wrapper'
                id='teamSidebarWrapper'
            >
                <Scrollbars
                    autoHide={true}
                    autoHideTimeout={500}
                    autoHideDuration={500}
                    renderThumbHorizontal={renderThumbHorizontal}
                    renderThumbVertical={renderThumbVertical}
                    renderView={renderView}

                >
                    {teams}
                </Scrollbars>
            </div>
            {plugins}
        </div>
    );

}
