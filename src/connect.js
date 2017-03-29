/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { Connect } from "react-redux";

export default function(business = {}) {
  const {
    sagas = [],
    reducerTrees = [],
    mapStateToProps,
    mapDispatchToProps
  } = business;

  const shouldUseConnect = typeof mapDispatchToProps === "function" ||
    typeof mapStateToProps === "object";
  const shouldUseBusiness = sagas.length > 0 || reducerTrees.length > 0;

  // connector is used only when shouldUseBusiness
  const connector = shouldUseBusiness
    ? Connect(mapStateToProps, mapDispatchToProps)
    : null;

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
