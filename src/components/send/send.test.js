import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Send from './send';

const fakeStore = configureStore();

describe('Send', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    const account = {
      balance: 1000e8,
      passphrase: 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit',
    };

    const store = fakeStore({
      account,
    });

    props = {
      activePeer: {},
      account,
      closeDialog: () => {},
      sent: sinon.spy(),
    };
    wrapper = mount(<Provider store={store}><Send {...props} /></Provider>);
  });

  it('renders two Input components', () => {
    expect(wrapper.find('Input')).to.have.length(2);
  });

  it('renders two Button components', () => {
    expect(wrapper.find('Button')).to.have.length(2);
  });

  it('accepts valid amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '120.25' } });
    expect(wrapper.find('.amount').text()).to.not.contain('Invalid');
  });

  it('recognizes invalid amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '120 INVALID' } });
    expect(wrapper.find('.amount').text()).to.contain('Invalid');
  });

  it('recognizes zero amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '0' } });
    expect(wrapper.find('.amount').text()).to.contain('Zero not allowed');
  });

  it('recognizes too high amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '12000' } });
    expect(wrapper.find('.amount').text()).to.contain('Insufficient funds');
  });

  it('recognizes empty amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '12000' } });
    wrapper.find('.amount input').simulate('change', { target: { value: '' } });
    expect(wrapper.find('.amount').text()).to.contain('Required');
  });

  it('accepts valid recipient', () => {
    wrapper.find('.recipient input').simulate('change', { target: { value: '11004588490103196952L' } });
    expect(wrapper.find('.recipient').text()).to.not.contain('Invalid');
  });

  it('recognizes invalid recipient', () => {
    wrapper.find('.recipient input').simulate('change', { target: { value: '11004588490103196952' } });
    expect(wrapper.find('.recipient').text()).to.contain('Invalid');
  });

  it('allows to set maximum amount', () => {
    wrapper.find('.transaction-amount').simulate('click');
    wrapper.find('.send-maximum-amount').simulate('click');
    expect(wrapper.find('.amount input').props().value).to.equal('999.9');
  });

  it('allows to send a transaction', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '120.25' } });
    wrapper.find('.recipient input').simulate('change', { target: { value: '11004588490103196952L' } });
    wrapper.find('.primary-button button').simulate('click');
    expect(props.sent).to.have.been.calledWith({
      account: props.account,
      activePeer: {},
      amount: '120.25',
      passphrase: props.account.passphrase,
      recipientId: '11004588490103196952L',
      secondPassphrase: null,
    });
  });
});
