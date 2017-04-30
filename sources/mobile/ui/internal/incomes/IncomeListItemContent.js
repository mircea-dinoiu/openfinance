import React from 'react';
import moment from 'moment';

import {Row, Col} from 'react-grid-system';

import Warning from 'material-ui/svg-icons/alert/warning';
import Cached from 'material-ui/svg-icons/action/cached';
import {grey500, grey700, yellowA700, cyan500} from 'material-ui/styles/colors';
import {Avatar} from 'material-ui';
import {numericValue} from '../../formatters';

import RepeatOptions from 'common/defs/repeatOptions';

const IncomeListItemContent = (props) => {
    const item = props.item;
    const userList = props.data.user.get('list');
    const currencies = props.data.currencies;
    const currencyISOCode = currencies.get('map').getIn([String(currencies.get('default')), 'iso_code']);

    return (
        <div>
            <Row>
                <Col xs={6}>{item.description}</Col>
                <Col xs={6} style={{textAlign: 'right'}}>
                    {userList.map(each => {
                        return item.user_id === each.get('id') ? (
                                <Avatar key={each.get('id')} src={each.get('avatar')} size={20} style={{marginLeft: 5}}/>
                            ) : null;
                    })}
                </Col>
            </Row>
            <Row>
                <Col xs={6}>
                        <span style={{fontSize: 14, float: 'left', lineHeight: '20px'}}>
                            {numericValue(item.sum, currencyISOCode)}
                        </span>
                    &nbsp;
                    {item.status === 'pending' && <Warning style={{height: 20, width: 20}} color={yellowA700}/>}
                    {item.repeat != null && <Cached style={{height: 20, width: 20}} color={cyan500}/>}
                </Col>
                <Col xs={6} style={{textAlign: 'right'}}>
                    {item.money_location_id && (
                        <span style={{fontSize: 14, color: grey700}}>{props.data.moneyLocations.find(each => each.get('id') === item.money_location_id).get('name')}</span>
                    )}
                </Col>
            </Row>
            {props.expanded && (
                <div>
                    <Row style={{fontSize: 14, color: grey500}}>
                        <Col xs={6}>{moment(item.created_at).format('lll')}</Col>
                        <Col xs={6} style={{textAlign: 'right'}}>{item.repeat ? `Repeats ${RepeatOptions.filter(each => each[0] === item.repeat)[0][1]}` : 'Does not repeat'}</Col>
                    </Row>
                </div>
            )}
        </div>
    );
};

export default IncomeListItemContent;