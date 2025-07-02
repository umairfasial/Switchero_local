#import "AppDelegate.h"
#import <Firebase.h>

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

 if ([FIRApp defaultApp] == nil) {
  [FIRApp configure];
}

  self.moduleName = @"Switchero";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};


  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end


// #import "AppDelegate.h"
// #import <Firebase.h>
// #import <UserNotifications/UserNotifications.h>
// #import <React/RCTBundleURLProvider.h>
// #import <React/RCTRootView.h>

// @interface AppDelegate () <UNUserNotificationCenterDelegate>
// @end

// @implementation AppDelegate

// - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
// {
//   if ([FIRApp defaultApp] == nil) {
//     [FIRApp configure];
//   }
  
//   // Request notification authorization
//   UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
//   center.delegate = self;
//   [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge)
//                         completionHandler:^(BOOL granted, NSError * _Nullable error) {
//                           if (!error) {
//                             NSLog(@"Request authorization succeeded!");
//                             [self getNotificationSettings];
//                           }
//                         }];

//   // Register for remote notifications
//   [application registerForRemoteNotifications];

//   // Your existing code here...
//   self.moduleName = @"Switchero";
//   self.initialProps = @{};
  
//   return [super application:application didFinishLaunchingWithOptions:launchOptions];
// }

// // Fetch and display current notification settings
// - (void)getNotificationSettings {
//   UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
//   [center getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
//     NSLog(@"Notification settings: %@", settings);
//   }];
// }

// // Implement the UNUserNotificationCenterDelegate methods
// - (void)userNotificationCenter:(UNUserNotificationCenter *)center
//        willPresentNotification:(UNNotification *)notification
//          withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
// {
//   completionHandler(UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge);
// }

// - (void)userNotificationCenter:(UNUserNotificationCenter *)center
// didReceiveNotificationResponse:(UNNotificationResponse *)response
//          withCompletionHandler:(void(^)(void))completionHandler
// {
//   completionHandler();
// }

// // Handle remote notification registration
// - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
//   // Forward the token to your server or to Firebase/Messaging
//   NSLog(@"APNS Token: %@", deviceToken);
// }

// - (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
//   NSLog(@"Failed to register for remote notifications: %@", error);
// }

// - (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
// {
// #if DEBUG
//   return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
// #else
//   return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
// #endif
// }

// @end
