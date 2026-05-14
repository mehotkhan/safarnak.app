# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Expo native modules convert JS option maps into Kotlin Record classes through
# reflection. Release R8 must keep record annotations, Kotlin metadata, and the
# affected native option classes or biometric/SQLite calls fail before JS logic.
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod
-keep class kotlin.Metadata { *; }
-keep class * implements expo.modules.kotlin.records.Record { *; }
-keep enum * implements expo.modules.kotlin.types.Enumerable { *; }
-keep class expo.modules.kotlin.records.** { *; }
-keep class expo.modules.kotlin.types.** { *; }
-keep class expo.modules.kotlin.allocators.** { *; }
-keep class expo.modules.localauthentication.** { *; }
-keep class expo.modules.sqlite.** { *; }

# MapLibre native map components are registered through React Native view
# managers and call into MapLibre Android SDK/plugins from JS. The package does
# not ship consumer ProGuard rules, so keep its bridge and native SDK classes in
# release builds.
-keep class org.maplibre.reactnative.** { *; }
-keep class org.maplibre.android.** { *; }
-keep class org.maplibre.geojson.** { *; }
-keep class org.maplibre.turf.** { *; }
-keep class org.maplibre.gl.** { *; }

# Add any project specific keep options here:
