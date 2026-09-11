# Expo/RN apps need SafeAreaView from the start, or headers overlap the status bar

**Context:** grid-mobile (Expo 57, React Native 0.86) had no safe-area handling
anywhere in the app. First screen tested on a real iPhone (via iPhone Mirroring)
showed the header logo and clock overlapping.

**Root cause:** Screens used a plain `View` as the root container with manual
`paddingTop` guesses instead of respecting the device's safe area insets.
This breaks on any notch/Dynamic-Island device — padding numbers that look
fine in a simulator without a notch don't hold up on real hardware.

**Fix applied:** Wrapped screen roots in React Native's built-in `SafeAreaView`
(no new dependency) instead of installing `react-native-safe-area-context`.
Works for iOS-only insets, which was enough here.

**Caveat:** RN's core `SafeAreaView` is deprecated and logs a warning
recommending `react-native-safe-area-context`. It's fine for a quick fix /
iOS-only app, but if Android or bottom-inset handling is ever needed, switch
to the maintained library instead of layering more manual padding fixes.

**Takeaway:** When building an Expo/RN app, add safe-area handling (native
`SafeAreaView` or `react-native-safe-area-context`) at the very first screen,
before it multiplies across every new screen someone adds later.
