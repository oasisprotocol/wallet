package net.oasis.wallet;

import android.os.Bundle;
import android.view.WindowManager; 
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Set secure flag to prevent app content from being captured in screenshots or recent apps view
        // Should be control by @capacitor plugin in the app, keeping this for safety
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE,
                             WindowManager.LayoutParams.FLAG_SECURE);
    }
}
