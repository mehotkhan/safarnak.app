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

# Add any project specific keep options here:

# ====================================
# ADVANCED APK SIZE REDUCTION RULES
# ====================================

# Aggressive optimization passes (more optimization iterations)
-optimizationpasses 5
-dontskipnonpubliclibraryclasses
-dontskipnonpubliclibraryclassmembers

# Optimization options - enable all safe optimizations
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*

# Allow R8 to aggressively optimize
-allowaccessmodification
-repackageclasses ''

# Remove logging (React Native & custom logs) in production
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
    public static *** w(...);
    public static *** e(...);
}

# ====================================
# REACT NATIVE CORE OPTIMIZATIONS
# ====================================

# Keep React Native core classes
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip
-keep,allowobfuscation @interface com.facebook.jni.annotations.DoNotStrip

# Do not strip any method/class that is annotated with @DoNotStrip
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keep @com.facebook.common.internal.DoNotStrip class *
-keep @com.facebook.jni.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
    @com.facebook.jni.annotations.DoNotStrip *;
}

-keepclassmembers @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
  void set*(***);
  *** get*();
}

# Keep native methods
-keepclasseswithmembernames,includedescriptorclasses class * {
    native <methods>;
}

# Keep setters in Views so that animations can still work.
-keepclassmembers public class * extends android.view.View {
    void set*(***);
    *** get*();
}

# Keep Activity class methods
-keepclassmembers class * extends android.app.Activity {
    public void *(android.view.View);
}

# Hermes bytecode optimizations
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# ====================================
# APOLLO CLIENT OPTIMIZATIONS
# ====================================

# Keep Apollo generated classes but allow obfuscation
-keep class com.apollographql.apollo3.** { *; }
-keepclassmembers class * {
    @com.apollographql.apollo3.annotations.GraphQLQuery *;
}

# Keep GraphQL operation classes
-keep class **.*Query { *; }
-keep class **.*Mutation { *; }
-keep class **.*Subscription { *; }
-keep class **.*Fragment { *; }

# ====================================
# EXPO & REACT NATIVE MODULES
# ====================================

# Expo modules
-keep class expo.modules.** { *; }
-keep class com.facebook.react.devsupport.** { *; }

# React Native Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }

# React Native Screens
-keep class com.swmansion.rnscreens.** { *; }

# React Native Safe Area Context
-keep class com.th3rdwave.safeareacontext.** { *; }

# Expo Router
-keep class com.facebook.react.** { *; }

# ====================================
# KOTLIN & KOTLINX OPTIMIZATIONS
# ====================================

# Kotlin reflect - can be removed if not used
-dontwarn kotlin.reflect.**

# Kotlinx coroutines
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
-keepclassmembers class kotlinx.coroutines.** {
    volatile <fields>;
}

# ====================================
# REMOVE UNUSED ANDROID COMPONENTS
# ====================================

# Remove Android components we don't use
-assumenosideeffects class android.widget.Toast {
    public static *** makeText(...);
}

# Remove debug-only code
-assumenosideeffects class * {
    void debug*(...);
    void trace*(...);
}

# ====================================
# OKHTTP & NETWORKING
# ====================================

# OkHttp platform used only on JVM and Android
-dontwarn okhttp3.internal.platform.**
-dontwarn org.conscrypt.**
-dontwarn org.bouncycastle.**
-dontwarn org.openjsse.**

# Keep OkHttp internals
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# ====================================
# JAVASCRIPT ENGINE (JSC / HERMES)
# ====================================

# JavaScriptCore (JSC) - only if using JSC instead of Hermes
-keep class org.webkit.** { *; }

# Keep important React Native classes
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.uimanager.** { *; }
-keep class com.facebook.react.views.** { *; }

# ====================================
# SERIALIZATION & JSON
# ====================================

# Keep JSON serialization classes
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# Keep Parcelable implementations
-keep class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator *;
}

# Keep Serializable classes
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# ====================================
# ADDITIONAL SIZE OPTIMIZATIONS
# ====================================

# Remove metadata and debug info
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Merge interfaces aggressively
-mergeinterfacesaggressively

# Remove assertions (saves code)
-assumenosideeffects class kotlin.jvm.internal.Intrinsics {
    public static void checkParameterIsNotNull(...);
    public static void checkExpressionValueIsNotNull(...);
    public static void checkNotNullExpressionValue(...);
    public static void checkReturnedValueIsNotNull(...);
    public static void checkFieldIsNotNull(...);
    public static void throwUninitializedPropertyAccessException(...);
}
