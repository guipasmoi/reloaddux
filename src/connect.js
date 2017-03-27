/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { Connect } from "react-redux";

export default function(business) {
  const shouldUseConnect = typeof business.mapDispatchToProps === "function" ||
    typeof business.mapStateToProps === "object";
  const shouldUseBusiness = business.sagas.length > 0 ||
    business.reducerTrees.length > 0;

  const connector = Connect(
    business.mapStateToProps,
    business.mapDispatchToProps
  );

  return ComponentToWrapped => {
    if (!shouldUseBusiness && !shouldUseConnect) {
      return ComponentToWrapped;
    }
    const ConnectedComponent = connector(ComponentToWrapped);
    if (!shouldUseBusiness) {
      return ConnectedComponent;
    }
    return class extends Component {
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
        return shouldUseConnect
          ? <ConnectedComponent {...this.props} />
          : <ComponentToWrapped {...this.props} />;
      }
    };
  };
}
