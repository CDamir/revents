import React, { Component } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react';

class EventForm extends Component {
    state = {
        title: '',
        date: '',
        city: '',
        venue: '',
        hostedBy: '',
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        this.props.createEvent(this.state);
    }

    handleInputChange = ({target:{name, value}}) => {
        this.setState({ [name]: value });
    }

    render() {
        const { cancelFormOpen } = this.props;
        const { title, date, city, venue, hostedBy } = this.state;
        return (
            <Segment>
                <Form onSubmit={this.handleFormSubmit} autoComplete="off">
                    <Form.Field>
                        <label>Event Title</label>
                        <input value={title} placeholder="First Name" onChange={this.handleInputChange} name="title"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Event Date</label>
                        <input type="date" value={date} placeholder="Event Date" onChange={this.handleInputChange} name="date"/>
                    </Form.Field>
                    <Form.Field>
                        <label>City</label>
                        <input placeholder="City event is taking place" value={city} onChange={this.handleInputChange} name="city"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Venue</label>
                        <input placeholder="Enter the Venue of the event" value={venue} onChange={this.handleInputChange} name="venue"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Hosted By</label>
                        <input placeholder="Enter the name of person hosting" value={hostedBy} onChange={this.handleInputChange} name="hostedBy"/>
                    </Form.Field>
                    <Button positive type="submit">
                        Submit
                      </Button>
                    <Button type="button" onClick={cancelFormOpen}>Cancel</Button>
                </Form>
            </Segment>
        )
    }
}
export default EventForm;