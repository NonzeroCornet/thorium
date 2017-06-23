import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, withApollo } from 'react-apollo';
import Immutable from 'immutable';
import { Container, Row, Col, Button, Input } from 'reactstrap';
import { TypingField } from '../../generic/core';


const SYSTEMS_SUB = gql`
subscription DamagedSystemsUpdate($simulatorId: ID){
  systemsUpdate(simulatorId: $simulatorId) {
    id
    name
    damage {
      damaged
      report
      requested
    }
    simulatorId
    type
  }
}`;

class DamageReportCore extends Component {
  constructor(props) {
    super(props);
    this.systemSub = null;
    this.state = {
      deck: null,
      room: null,
      selectedSystem: null,
      selectedReport: ''
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.systemSub && !nextProps.data.loading) {
      this.systemSub = nextProps.data.subscribeToMore({
        document: SYSTEMS_SUB,
        variables: {
          simulatorId: nextProps.simulator.id
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          const returnResult = Immutable.Map(previousResult);
          return returnResult.merge({ systems: subscriptionData.data.systemsUpdate }).toJS();
        }
      });
    }
  }
  selectSystem(id){
    const systems = this.props.data.systems;
    const selectedSystem = systems.find(s => s.id === id)
    this.setState({
      selectedSystem: id,
      selectedReport: selectedSystem.damage.report || ''
    })
  }
  systemStyle(sys){
    const obj = {
      listStyle: 'none',
      cursor: 'pointer'
    };
    if (sys.damage.damaged) {
      obj.color = 'red';
    }
    if (!sys.name) {
      obj.color = 'purple';
    }
    return obj;
  }
  systemName(sys) {
    if (sys.type === 'Shield'){
      return `${sys.name} Shields`;
    }
    if (sys.type === 'Engine'){
      return `${sys.name} Engines`;
    }
    return sys.name;
  }
  loadReport(e) {
    const self = this;
    var reader = new FileReader();
    reader.onload = function() {
      const result = this.result;
      self.setState({
        selectedReport: result
      })
    };
    reader.readAsText(e.target.files[0]);
  }
  sendReport() {
    const mutation = gql`
    mutation DamageReport ($systemId: ID!, $report: String!) {
      damageReport(systemId: $systemId, report: $report)
    }`;
    const variables = {
      systemId: this.state.selectedSystem,
      report: this.state.selectedReport
    };
    this.props.client.mutate({
      mutation,
      variables
    });
  }
  render(){
    if (this.props.data.loading) return null;
    const systems = this.props.data.systems;
    const {selectedReport} = this.state;
    return <Container fluid className="damageReport-core">
    <p>Damage Report Request</p>
    <Row style={{height: 'calc(100% - 24px)'}}>
    <Col sm={4} style={{overflow: 'scroll'}}>
    {
      systems.filter(s => s.damage.damaged)
      .map(s => <p key={s.id} 
        className={`${this.state.selectedSystem === s.id ? 
          'selected' : ''} 
          ${s.damage.requested ? 'requested' : ''}
          ${s.damage.report ? 'report' : ''}`} 
          onClick={this.selectSystem.bind(this, s.id)}>
          {this.systemName(s)}
          </p>)
    }
    </Col>
    <Col sm={8}>
    <TypingField 
    value={selectedReport}
    style={{
      textAlign: 'left', 
      height: 'calc(100% - 44px)',
      fontFamily: 'monospace',
    }}
    rows={5} 
    controlled={true} onChange={(e) => {this.setState({
      selectedReport: e.target.value
    })}} />
    <Row style={{margin: 0}} >
    <Col sm={6}>
    <Input onChange={this.loadReport.bind(this)} style={{position: 'absolute', opacity: 0}} type="file" name="file" id="exampleFile" />
    <Button size={'sm'} block color="info">Load Report</Button>
    </Col>
    <Col sm={6}>
    <Button size={'sm'} block color="primary" onClick={this.sendReport.bind(this)}>Send Report</Button>
    </Col>
    </Row>
    </Col>
    </Row>
    </Container>
  }
}
const SYSTEMS_QUERY = gql`
query DamagedSystems($simulatorId: ID){
  systems(simulatorId: $simulatorId) {
    id
    name
    damage {
      damaged
      report
      requested
    }
    simulatorId
    type
  }
}`;

export default graphql(SYSTEMS_QUERY, {
  options: (ownProps) => ({ variables: { simulatorId: ownProps.simulator.id } }),
})(withApollo(DamageReportCore));