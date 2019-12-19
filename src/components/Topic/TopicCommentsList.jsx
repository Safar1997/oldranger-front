import React from 'react';
import { List, Spin } from 'antd';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import TopicCommentItem from './TopicCommentItem';
import queries from '../../serverQueries';
import { ReplyFloatButton, StyledTopicMessages, TopicTitle } from './styled';
import TopicReplyForm from './TopicReplyForm';

class TopicCommentsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      messages: [],
      hasMore: true,
      page: 0,
    };
    this.replyForm = React.createRef();
  }

  componentDidMount() {
    this.getTopics().then(data => {
      const { topic, commentDto } = data;
      const messageFromTopic = {
        topicId: topic.subsection.id,
        author: topic.topicStarter,
        commentDateTime: topic.startTime,
        messageCount: topic.messageCount,
        replyDateTime: null,
        replyNick: null,
        replyText: null,
        commentText: topic.startMessage,
      };
      this.setState({ messages: [messageFromTopic, ...commentDto], name: topic.name });
    });
  }

  getTopics = async () => {
    const { topicId } = this.props;
    const { page } = this.state;
    const resp = await queries.getTopic(topicId, page);
    this.setState({ page: page + 1 });
    return resp;
  };

  replyButtonHandler = () => {
    this.replyForm.focus();
  };

  lazyLoadMore = () => {
    const { messages } = this.state;
    this.getTopics().then(({ commentDto }) => {
      if (commentDto.length === 0) {
        this.setState({ hasMore: false });
      } else {
        this.setState({ messages: [...messages, ...commentDto] });
      }
    });
  };

  render() {
    const { messages, name, hasMore } = this.state;
    return messages.length > 0 ? (
      <StyledTopicMessages>
        <TopicTitle>{name}</TopicTitle>
        <InfiniteScroll
          dataLength={messages.length}
          next={this.lazyLoadMore}
          hasMore={hasMore}
          loader={<Spin />}
        >
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={item => <TopicCommentItem comment={item} />}
          />
        </InfiniteScroll>
        <ReplyFloatButton type="primary" icon="message" onClick={this.replyButtonHandler}>
          Reply
        </ReplyFloatButton>
        <TopicReplyForm
          replyRef={element => {
            this.replyForm = element;
          }}
        />
      </StyledTopicMessages>
    ) : (
      <Spin />
    );
  }
}

TopicCommentsList.propTypes = {
  topicId: PropTypes.string.isRequired,
};

export default TopicCommentsList;