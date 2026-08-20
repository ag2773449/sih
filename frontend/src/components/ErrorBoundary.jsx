import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-content mx-auto px-4 py-16">
          <div className="hc-surface rounded-xl2 border border-clay-600 bg-white p-6 shadow-soft">
            <p className="font-semibold text-clay-700 mb-2">Something went wrong.</p>
            <p className="text-sm text-ink-600">Refresh the page and try again. If the problem persists, please check your connection.</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}