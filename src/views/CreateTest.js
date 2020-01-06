import React from 'react';
import PageTitle from '../components/common/PageTitle';
import NavButton from '../components/common/NavButton';
import Loading from '../components/common/Loading';
import TimeKeeper from 'react-timekeeper';

import firebase from './../firebase';

import {
  Container,
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
  Button,
  DatePicker
} from 'shards-react';

class CreateTest extends React.Component {
  constructor(props) {
    super();
    this.state = {
      id: '',
      examName: '',
      examDate: '',
      examTime: '',
      subject: '',
      description: '',
      pageMode: 'add',
      loading: false,
      pageTitle: 'Create Test',
      inputDisabled: false
    };

    this.props = props;

    if (props.location.state) {
      this.state = props.location.state;
      this.state.pageMode = 'view';
      this.state.inputDisabled = true;
      this.state.loading = false;
      this.state.pageTitle = 'View Test';
    }
  }
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleStartDateChange = value => {
    this.setState({
      ...this.state,
      ...{ examDate: new Date(value) }
    });
  };

  handleSetTimeChange = value => {
    const [time, setTime] = useState('12:34pm');

    this.setState(
      <div>
        <Timekeeper
          time={time}
          onChange={newTime => setTime(newTime.formatted12)}
        />
        <span>Time is {time}</span>
      </div>
    );
  };

  addTest = () => {
    this.setState({ loading: true });

    const userRef = firebase.firestore().collection('tests');
    userRef
      .add({
        examName: this.state.examName,
        examDate: this.state.examDate,
        examTime: this.state.examTime,
        subject: this.state.subject,
        description: this.state.description
      })
      .then(d => {
        if (d) {
          this.setState({
            loading: false,
            pageMode: 'view',
            inputDisabled: true,
            pageTitle: 'View Test',
            id: d.id
          });
        }
      });
  };

  updateTest = () => {
    this.setState({ loading: true });

    const updateRef = firebase
      .firestore()
      .collection('tests')
      .doc(this.state.id);

    updateRef
      .set({
        examName: this.state.examName,
        examDate: this.state.examDate,
        examTime: this.state.examTime,
        subject: this.state.subject,
        description: this.state.description
      })
      .then(docRef => {
        this.setState({ loading: false });
      })
      .catch(error => {
        this.setState({ loading: false });
        console.error('Error adding document: ', error);
      });
  };

  render() {
    const item = {
      title: 'Test List',
      to: '/tests'
    };
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle
            title={this.state.pageTitle}
            subtitle="Overview"
            className="ml-sm-auto mr-sm-auto"
          />
          <NavButton sm="4" key={111} item={item} className="text-sm-right" />
        </Row>

        <Row>
          <Col lg="6">
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">{this.state.title}</h6>
              </CardHeader>
              <ListGroup flush>
                <ListGroupItem className="p-3">
                  <Row>
                    <Col>
                      <Form>
                        <Row form>
                          <Col md="6" className="form-group">
                            <label htmlFor="examName">Exam Name</label>
                            <FormInput
                              id="examName"
                              name="examName"
                              placeholder="Exam Name"
                              value={this.state.examName}
                              onChange={this.handleChange}
                            />
                          </Col>
                          <Col md="6" className="form-group">
                            <label htmlFor="fesubject">Subject</label>
                            <FormSelect
                              id="fesubject"
                              name="subject"
                              value={this.state.subject}
                              onChange={this.handleChange}
                            >
                              <option>Choose...</option>
                              <option>English</option>
                              <option>Maths</option>
                              <option>Science</option>
                              <option>General Knowledge</option>
                              <option>Fundamental Science</option>
                              <option>Computer Science</option>
                              <option>Social Science</option>
                              <option>Chemistry</option>
                              <option>Botany</option>
                              <option>Physics</option>
                            </FormSelect>
                          </Col>
                        </Row>
                        <Row form>
                          <Col md="2" className="form-group">
                            <label htmlFor="feDate">Date</label>
                            <br />
                            <DatePicker
                              id="feDate"
                              name="examDate"
                              size="sm"
                              selected={this.state.examDate}
                              onChange={this.handleStartDateChange}
                              placeholderText="Start Date"
                              dropdownMode="select"
                              className="text-center"
                            />
                          </Col>
                          <Col md="2" className="form-group">
                            <label htmlFor="feExamTime">Time</label>
                            <FormInput
                              id="feExamTime"
                              name="examTime"
                              placeholder="Time"
                              value={this.state.examTime}
                              onChange={this.handleSetTimeChange}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col md="12" className="form-group">
                            <label htmlFor="feDescription">Description</label>
                            <FormTextarea
                              id="feDescription"
                              name="description"
                              rows="5"
                              onChange={this.handleChange}
                            />
                          </Col>
                        </Row>
                        {this.state.pageMode === 'add' ? (
                          <Button theme="accent" onClick={this.addTest}>
                            Add Test
                          </Button>
                        ) : (
                          <Button theme="accent" onClick={this.updateTest}>
                            Update Test
                          </Button>
                        )}
                      </Form>
                    </Col>
                  </Row>
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
          <Col lg="6">
            <Card small className="mb-4">
              <Loading open={this.state.loading} />
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default CreateTest;
