from pathlib import Path
import xml.etree.ElementTree as ET

styles=Path('android/app/src/main/res/values/styles.xml')
tree=ET.parse(styles)
style=tree.getroot().find("style[@name='AppTheme.NoActionBar']")
assert style is not None
for name,value in {'android:windowBackground':'#101523','android:statusBarColor':'#101523','android:navigationBarColor':'#171e2e','android:windowLightStatusBar':'false','android:windowLightNavigationBar':'false','android:enforceNavigationBarContrast':'false'}.items():
 item=style.find(f"item[@name='{name}']")
 if item is None:item=ET.SubElement(style,'item',{'name':name})
 item.text=value
tree.write(styles,encoding='utf-8',xml_declaration=True)

# A purpose-built pixel avatar icon; no borrowed game art.
vector='''<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108">
<path android:fillColor="#101523" android:pathData="M0,0h108v108H0z"/>
<path android:fillColor="#244846" android:pathData="M20,26h68v56H20z"/>
<path android:fillColor="#9ae1c3" android:pathData="M51,15h6v8h8v6h-8v8h-6v-8h-8v-6h8zM23,43h4v4h-4zM82,38h4v4h-4zM77,69h4v4h-4zM27,71h4v4h-4z"/>
<path android:fillColor="#536f7f" android:pathData="M35,62h38v18H35z"/>
<path android:fillColor="#dfbda3" android:pathData="M43,41h22v22H43zM31,68h5v8h-5zM72,68h5v8h-5z"/>
<path android:fillColor="#2c3049" android:pathData="M40,36h28v10H40zM40,44h5v12h-5zM61,44h7v8h-7z"/>
<path android:fillColor="#34475d" android:pathData="M48,51h3v3h-3zM57,51h3v3h-3zM38,80h11v7H38zM59,80h11v7H59z"/>
<path android:fillColor="#9ae1c3" android:pathData="M39,62h31v5H39zM60,66h5v11h-5zM31,88h46v4H31z"/>
</vector>'''
resources=Path('android/app/src/main/res')
(resources/'drawable/aura_icon.xml').write_text(vector)
colors=resources/'values/aura_colors.xml';colors.write_text('<resources><color name="aura_background">#101523</color></resources>')
adaptive='<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android"><background android:drawable="@color/aura_background"/><foreground android:drawable="@drawable/aura_icon"/></adaptive-icon>'
for folder,data in [('mipmap-anydpi',vector),('mipmap-anydpi-v26',adaptive)]:
 (resources/folder).mkdir(exist_ok=True)
 for name in ['ic_launcher.xml','ic_launcher_round.xml']:(resources/folder/name).write_text(data)

# Keep test updates compatible through an explicit project-local cached debug key.
gradle=Path('android/app/build.gradle')
gradle.write_text(gradle.read_text()+'''
android {
 signingConfigs {
  debug {
   storeFile rootProject.file('aura-vale-debug.keystore')
   storePassword 'android'
   keyAlias 'androiddebugkey'
   keyPassword 'android'
  }
 }
}
''')
