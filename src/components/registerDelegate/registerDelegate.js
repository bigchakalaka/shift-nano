import React from 'react';
import Input from 'react-toolbox/lib/input';
import InfoParagraph from '../infoParagraph';
import ActionBar from '../actionBar';
import Fees from '../../constants/fees';
import AuthInputs from '../authInputs';
import { handleChange, authStatePrefill } from '../../utils/form';

class RegisterDelegate extends React.Component {
  constructor() {
    super();

    this.state = {
      name: {
        value: '',
      },
      ...authStatePrefill(),
    };
  }
  componentDidMount() {
    const newState = {
      name: {
        value: '',
      },
      ...authStatePrefill(this.props.account),
    };
    this.setState(newState);
  }

  register() {
    // @todo I'm not handling this part: this.setState({ nameError: error.message });
    this.props.delegateRegistered({
      activePeer: this.props.peers.data,
      account: this.props.account,
      username: this.state.name.value,
      passphrase: this.state.passphrase.value,
      secondPassphrase: this.state.secondPassphrase.value,
    });
  }

  render() {
    return (
      <div>
        <Input label='Delegate name' required={true}
          autoFocus={true}
          className='username'
          onChange={handleChange.bind(this, this, 'name')}
          error={this.state.name.error}
          value={this.state.name.value} />
        <AuthInputs
          passphrase={this.state.passphrase}
          secondPassphrase={this.state.secondPassphrase}
          onChange={handleChange.bind(this, this)} />
        <hr/>
        <InfoParagraph>
          Becoming a delegate requires registration. You may choose your own
          delegate name, which can be used to promote your delegate. Only the
          top 101 delegates are eligible to forge. All fees are shared equally
          between the top 101 delegates.
        </InfoParagraph>
        <ActionBar
          secondaryButton={{
            onClick: this.props.closeDialog,
          }}
          primaryButton={{
            label: 'Register',
            fee: Fees.registerDelegate,
            className: 'register-button',
            disabled: (!this.state.name.value ||
              this.props.account.isDelegate ||
              !!this.state.passphrase.error ||
              !!this.state.secondPassphrase.error ||
              this.state.secondPassphrase.value === '' ||
              !this.state.passphrase.value),
            onClick: this.register.bind(this),
          }} />
      </div>
    );
  }
}

export default RegisterDelegate;
