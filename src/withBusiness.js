/* eslint-disable no-unused-vars */
import React, { Component } from "react";

export default function withBusiness(business) {
  return ComponentToWrapped =>
    class extends Component {
      static contextTypes = {
        store: React.PropTypes.object
      };

      constructor(props, context) {
        super(props, context);
        this.store = this.context.store;
      }

      componentWillMount() {
        this.store.registerBusiness(business);
      }

      componentWillUnmount() {
        this.store.unregisterBusiness(business);
      }

      render() {
        return <ComponentToWrapped {...this.props} />;
      }
    };
}
