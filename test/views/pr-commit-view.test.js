import moment from 'moment';
import React from 'react';
import {shallow} from 'enzyme';

import PrCommitView from '../../lib/views/pr-commit-view';

const defaultProps = {
  committerAvatarUrl: 'https://avatars3.githubusercontent.com/u/3781742',
  committerName: 'Margaret Hamilton',
  date: '2018-05-16T21:54:24.500Z',
  messageHeadline: 'This one weird trick for getting to the moon will blow your mind 🚀',
  abbreviatedOid: 'bad1dea',
  url: 'https://github.com/atom/github/pull/1684/commits/bad1deaea3d816383721478fc631b5edd0c2b370',
};
const getProps = function(overrides = {}) {
  return {
    ...defaultProps,
    ...overrides,
  };
};

describe('PrCommitView', function() {
  function buildApp(opts, overrideProps = {}) {
    return <PrCommitView {...getProps(opts, overrideProps)} />;
  }
  it('renders the commit view for commits without message body', function() {
    const wrapper = shallow(buildApp({}));
    assert.deepEqual(wrapper.find('.github-PrCommitView-title').text(), defaultProps.messageHeadline);
    const imageHtml = wrapper.find('.github-PrCommitView-avatar').html();
    assert.ok(imageHtml.includes(defaultProps.committerAvatarUrl));

    const humanizedTimeSince = moment(defaultProps.date).fromNow();
    const expectedMetaText = `${defaultProps.committerName} committed ${humanizedTimeSince}`;
    assert.deepEqual(wrapper.find('.github-PrCommitView-metaText').text(), expectedMetaText);

    assert.ok(wrapper.find('a').html().includes(defaultProps.url));

    assert.lengthOf(wrapper.find('.github-PrCommitView-moreButton'), 0);
    assert.lengthOf(wrapper.find('.github-PrCommitView-moreText'), 0);
  });

  it('renders the toggle button for commits with message body', function() {
    const messageBody = 'spoiler alert, you will believe what happens next';
    const wrapper = shallow(buildApp({messageBody}));
    const toggleButton = wrapper.find('.github-PrCommitView-moreButton');
    assert.lengthOf(toggleButton, 1);
    assert.deepEqual(toggleButton.text(), 'show more...');
  });

  it('toggles the commit message body when button is clicked', function() {
    const messageBody = 'stuff and things';
    const wrapper = shallow(buildApp({messageBody}));

    // initial state is toggled off
    assert.lengthOf(wrapper.find('.github-PrCommitView-moreText'), 0);

    // toggle on
    wrapper.find('.github-PrCommitView-moreButton').simulate('click');
    const moreText = wrapper.find('.github-PrCommitView-moreText');
    assert.lengthOf(moreText, 1);
    assert.deepEqual(moreText.text(), messageBody);
    assert.deepEqual(wrapper.find('.github-PrCommitView-moreButton').text(), 'hide more...');

    // toggle off again
    wrapper.find('.github-PrCommitView-moreButton').simulate('click');
    assert.lengthOf(wrapper.find('.github-PrCommitView-moreText'), 0);
    assert.deepEqual(wrapper.find('.github-PrCommitView-moreButton').text(), 'show more...');
  });
});