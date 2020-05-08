import React, {Component} from "react";
import {Container, Row, Col, Card, CardBody, Button} from "helpers/reactstrap";
import gql from "graphql-tag.macro";
import {Query, Mutation} from "react-apollo";
import "./style.scss";
import TaskConfig from "./taskConfig";
import DefinitionList from "./definitionList";
import TemplateList from "./templateList";
const QUERY = gql`
  query TaskDefinitions {
    taskDefinitions {
      id
      class
      name
      stations {
        name
      }
      valuesInput
      valuesValue
    }
  }
`;

const THORIUM_QUERY = gql`
  query Thorium {
    thorium {
      addedTaskTemplates
    }
  }
`;
class TaskTemplates extends Component {
  state = {selectedDef: "nothing"};
  render() {
    const {selectedDef, selectedTemplate} = this.state;
    const {taskTemplates} = this.props;
    return (
      <Query query={QUERY}>
        {({loading, data}) => {
          if (loading || !data) return null;
          const {taskDefinitions} = data;
          const taskTemplate = taskTemplates.find(
            t => t.id === selectedTemplate,
          );
          return (
            <Container fluid className="task-templates">
              <Row>
                <Col
                  sm={3}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "80vh",
                  }}
                >
                  <div style={{flex: 1}}>
                    <DefinitionList
                      taskDefinitions={taskDefinitions}
                      taskTemplates={taskTemplates}
                      selectedDef={selectedDef}
                      setSelectedDef={v => this.setState({selectedDef: v})}
                    />
                  </div>
                  <Query query={THORIUM_QUERY}>
                    {({data}) =>
                      data &&
                      data.thorium &&
                      !data.thorium.addedTaskTemplates ? (
                        <Mutation
                          mutation={gql`
                            mutation ImportTemplates {
                              importTaskTemplates
                            }
                          `}
                          refetchQueries={[
                            {query: QUERY},
                            {query: THORIUM_QUERY},
                          ]}
                        >
                          {action => (
                            <Button block onClick={action}>
                              Import Repair Templates
                            </Button>
                          )}
                        </Mutation>
                      ) : null
                    }
                  </Query>
                  <Button
                    tag="a"
                    href={`/exportTaskTemplates/${taskTemplates
                      .map(t => t.id)
                      .join(",")}`}
                    color="secondary"
                    block
                    size="sm"
                  >
                    Export All Templates
                  </Button>
                  <label>
                    <div className="btn btn-sm btn-info btn-block">
                      Import Task Templates
                    </div>
                    <input
                      hidden
                      type="file"
                      onChange={evt => {
                        if (evt?.target?.files?.[0]) {
                          const data = new FormData();
                          Array.from(evt.target.files).forEach((f, index) =>
                            data.append(`files[${index}]`, f),
                          );
                          fetch(`/importTaskTemplates`, {
                            method: "POST",
                            body: data,
                          }).then(() => {
                            window.location.reload();
                          });
                        }
                      }}
                    />
                  </label>
                </Col>
                <Col sm={4} style={{display: "flex", flexDirection: "column"}}>
                  <TemplateList
                    taskTemplates={taskTemplates}
                    selectedDef={selectedDef}
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={v =>
                      this.setState({selectedTemplate: v})
                    }
                  />
                  {selectedDef !== "nothing" && (
                    <>
                      <Mutation
                        mutation={gql`
                          mutation AddTaskTemplate($definition: String!) {
                            addTaskTemplate(definition: $definition)
                          }
                        `}
                        variables={{definition: selectedDef}}
                      >
                        {action => (
                          <Button
                            color="success"
                            onClick={() =>
                              action().then(({data: {addTaskTemplate}}) =>
                                this.setState({
                                  selectedTemplate: addTaskTemplate,
                                }),
                              )
                            }
                          >
                            Add Template
                          </Button>
                        )}
                      </Mutation>

                      <Button
                        tag="a"
                        href={`/exportTaskTemplates/${taskTemplates
                          .filter(t => t.definition === selectedDef)
                          .map(t => t.id)
                          .join(",")}`}
                        color="secondary"
                        block
                        size="sm"
                      >
                        Export Templates
                      </Button>
                    </>
                  )}
                  {taskTemplate && (
                    <Mutation
                      mutation={gql`
                        mutation RemoveTaskTemplate($id: ID!) {
                          removeTaskTemplate(id: $id)
                        }
                      `}
                      variables={{id: taskTemplate.id}}
                    >
                      {action => (
                        <Button
                          color="danger"
                          onClick={() =>
                            action().then(() =>
                              this.setState({selectedTemplate: null}),
                            )
                          }
                        >
                          Remove Template
                        </Button>
                      )}
                    </Mutation>
                  )}
                </Col>
                {taskTemplate && (
                  <Col sm={5} key={taskTemplate.id}>
                    <h3>Template Config</h3>
                    <Card style={{maxHeight: "70vh", overflowY: "auto"}}>
                      <CardBody>
                        <TaskConfig
                          {...taskTemplate}
                          definition={taskDefinitions.find(
                            d => d.name === taskTemplate.definition,
                          )}
                        />
                      </CardBody>
                    </Card>
                  </Col>
                )}
              </Row>
            </Container>
          );
        }}
      </Query>
    );
  }
}

export default TaskTemplates;
