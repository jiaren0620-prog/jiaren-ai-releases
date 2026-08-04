(function installJiarenDomCompatibilityGuard() {
  const nativeRemoveChild = Node.prototype.removeChild;

  Node.prototype.removeChild = function removeChild(child) {
    if (child && child.parentNode !== this) {
      const actualParent = child.parentNode;
      console.warn("Jiaren canvas skipped stale DOM cleanup", {
        expectedParent: this,
        actualParent,
        child,
      });
      return child;
    }

    return nativeRemoveChild.call(this, child);
  };
})();
