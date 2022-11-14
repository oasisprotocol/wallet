/**
 * Usage: Add to sensitive inputs, textareas, and parent forms (because Chrome
 * doesn't support it on textareas).
 *
 * Browsers write visible input fields from any website to user data to enable
 * restoring sessions. Browsers exclude inputs with autocomplete="off" from
 * cached form data in the session history (even though they ignore it and still
 * offer autofill from saved passwords). Browsers with enhanced spellcheck also
 * send it to the cloud.
 *
 * To ensure this fixes vulnerability:
 * - Manually checked
 *   grep --text t.e.s.t.M.n.e.m.o.n.i.c -r ~/.config/google-chrome
 *   grep --text testMnemonic -r ~/.mozilla/firefox
 * - Added CSS to visually warn about sensitive input fields missing
 *   preventSavingInputsToUserData
 *
 * References:
 * - https://nvd.nist.gov/vuln/detail/CVE-2022-32969
 * - https://coinyuppie.com/slow-mist-a-brief-analysis-of-the-metamask-wallet-demonic-vulnerability/
 * - https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion
 * - https://nvd.nist.gov/vuln/detail/CVE-2022-0167
 * - https://www.otto-js.com/news/article/spell-jacking-enhanced-spellcheck-features-send-pii-even-passwords
 */
export const preventSavingInputsToUserData = {
  autoComplete: 'off',
  autoCapitalize: 'off',
  autoCorrect: 'off',
  spellCheck: false,
}
