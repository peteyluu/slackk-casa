import React from 'react';
import {
  Button, 
  Container,
  Form,
  FormGroup,
  FormText,
  Input,
  Label
} from 'reactstrap';

export default class ProfileInformationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      user: {},
      fullname: '',
      status: '',
      bio: '',
      phone: '',
      updateSuccess: false,
      save: false,
    }
    this.onSave = this.onSave.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    this.getUserProfile();
  }

  getUserProfile() {
    let { username } = this.state
    //GET request to server/db from profiles table using this.state.username
    fetch(`/profile/${username}`, {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    })
      //update this.state.userProfile to returned object
      .then(resp => { return resp.json() })
      .then(data => {
        this.setState({ 
          user: data, 
          fullname: data.fullname || '', 
          status: data.status || '', 
          bio: data.bio || '',
          phone: data.phone || ''
        })
      })
      .catch(console.error);
  }

  //each will update the current state (make sure that if the changes are not saved, the values will revert back to original)
  //refactor to submit button & handling submit?? (e.preventDefault())
  onChange(event, input) {
    if (input === 'fullname') {
      this.setState({ fullname: event.target.value, save: true, updateSuccess: false })
    }
    if (input === 'status') {
      this.setState({ status: event.target.value, save: true, updateSuccess: false })
    }
    if (input === 'bio') {
      this.setState({ bio: event.target.value, save: true, updateSuccess: false })
    }
    if (input === 'phone') {
      this.setState({ phone: event.target.value, save: true, updateSuccess: false })
    }
  }

  //POST to /profile, update database
  onSave() {
    let { username, fullname, status, bio, phone }=this.state;
    fetch('/profile', {
      method: 'POST',
      body: JSON.stringify({ username, fullname, status, bio, phone }),
      headers: { 'content-type': 'application/json' }
    })
    .then(resp => 
      (resp.status === 200
      ? this.setState({ updateSuccess: true, save: false })
      : undefined ))
    .catch(console.error);
  }


  render() {
    let { username, fullname, status, bio, phone, save, updateSuccess } = this.state;
    const styles = {
      container: {
        padding: '20px'
      }
    }
    return(
      <Container style={styles.container}>
        <Form>
          <FormGroup>
            <Label for="fullname">Full Name</Label>
            <Input
              type="text"
              id="fullname"
              placeholder={fullname}
              onChange={(event) => this.onChange(event, 'fullname')}
            />
          </FormGroup>
          <FormGroup>
            <Label for="status">Status</Label>
            <Input type="select" id="status" value={status} onChange={(event) => this.onChange(event, 'status')}>
              <option value=""> </option>
              <option value="Away">Away</option>
              <option value="In a Meeting">In a Meeting</option>
              <option value="Working Remote">Working Remote</option>
              <option value="Vacationing">Vacationing</option>
              <option value="Out Sick">Out Sick</option>
            </Input>
            <FormText color="muted">
              Let others know what you're doing.
            </FormText>
          </FormGroup>

          <FormGroup>
            <Label for="bio">Bio</Label>
            <Input 
              type="text" 
              id="bio" 
              placeholder={bio} 
              onChange={(event) => this.onChange(event, 'bio')}
            />
            <FormText color="muted">
              Tell others a little about yourself.
            </FormText>
          </FormGroup>

          <FormGroup>
            <Label for="phone">Phone</Label>
            <Input 
              type="text" 
              id="phone" 
              placeholder={phone}
              onChange={(event) => this.onChange(event, 'phone')}
            />
          </FormGroup>
        </Form>
        <Button onClick={this.onSave} color="success" disabled={!save}>
          { updateSuccess ? 'Updated!' : 'Update Profile Info' }
        </Button>
      </Container>
    )
  }
}