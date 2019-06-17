// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';

export default class LineSwitch extends React.PureComponent {
    static propTypes = {
        title: PropTypes.node.isRequired,
        toggled: PropTypes.bool.isRequired,
        subTitle: PropTypes.node.isRequired,
        onToggle: PropTypes.func.isRequired,
        children: PropTypes.node,
    };

    render() {
        const {title, subTitle, toggled, onToggle, children} = this.props;
        return (<div style={{paddingBottom: 10}}>
            <div className='row align-items-start'>
                <div className='col-sm-10'>
                    <label className='control-label'>{title}</label>
                </div>
                <div className='col-sm-2'>
                    <label className='checkbox-inline'>
                        <input
                            type='checkbox'
                            checked={toggled}
                            onChange={onToggle}
                        />
                    </label>
                </div>
            </div>
            <div className='row'>
                <div className='col-sm-10'>
                    <div className='help-text'>{subTitle}</div>
                </div>
            </div>
            {children}
        </div>);
    }
}
