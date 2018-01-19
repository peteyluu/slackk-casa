import React from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem, Button } from 'reactstrap';
import MessageList from './MessageList.jsx';
import WorkSpaceList from './WorkSpaceList.jsx';
import PropTypes from 'prop-types';
import SearchResults from './SearchResults.jsx'
import MemberList from './MemberList.jsx';

//container for other containers
export default class Body extends React.Component {
  constructor(props) {
    super(props);
    this.directMessage = this.directMessage.bind(this);
  }

  // MemberEntry + MessageEntry, fires this method onClick
  // @ param `toUser`: the other user
  directMessage(toUser) {
    const { loadWorkSpaces, username } = this.props;
    /*
      body: {
        toUser: toUser,
        fromUser: username,
        name: `${toUser}-${username}`
      }
    */
    fetch('/directmsg', {
      method: 'POST',
      body: JSON.stringify({ fromUser: username, toUser, name: `${toUser}-${username}` }),
      headers: { 'content-type': 'application/json' },
    })
      .then(resp => (resp.status === 201 ? loadWorkSpaces() : console.log('directmsg failed')))
      .catch(console.error);
  }

  render() {
    let {
      workSpaces,
      messages,
      filteredMessages,
      loadWorkSpaces,
      changeCurrentWorkSpace,
      currentWorkSpaceId,
      users,
      username,
      currentWorkSpaceName,
    } = this.props;
    return (
      <Container fluid>
        <Row>
          <Col className="side-bar-col" xs="2">
            <WorkSpaceList
              workSpaces={workSpaces}
              loadWorkSpaces={loadWorkSpaces}
              changeCurrentWorkSpace={changeCurrentWorkSpace}
              currentWorkSpaceId={currentWorkSpaceId}
              currentWorkSpaceName={currentWorkSpaceName}
            />
            <MemberList
              directMessage={this.directMessage}
              users={users}
              username={username}
              changeCurrentWorkSpace={changeCurrentWorkSpace}
            />
          </Col>
          <Col className="message-list-col" xs="10">
          {!filteredMessages ? 
            <MessageList messages={messages} currentWorkSpaceId={currentWorkSpaceId} directMessage={this.directMessage}/> :
            <SearchResults messages={filteredMessages} />
          }
          </Col>
        </Row>
      </Container>
    );
  }
}

Body.propTypes = {
  messages: PropTypes.array,
  workspaces: PropTypes.array,
  currentWorkSpaceId: PropTypes.number,
}