// styles.js
import { StyleSheet } from "react-native";

export const dinutrientStyles = StyleSheet.create({

    //******** GENERAL STYLES *********// 

    screen: {
        backgroundColor: "#d4fbdaff"
    },
    // container style used for most screens
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center'
    },

    // container style used to occupy full space
    fullSpace: { flex: 1 },

    // container style used for flex layout
    flexRow: {
        flexDirection: "row",
        gap: 10, 
        alignItems: "center",
        flexWrap: "wrap",
        flex: 1,
    },

    // container style used for flex layout with space between
    flexSpaceBetween: {
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        justifyContent:'space-between',
        flexWrap: "wrap",
    },

    // container for the loading animation, so it appears topmost and centered
    tapeAnimationContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
    },

    //******** LOGO CONTAINER STYLES *********// 

    // container style to display the logo large and centered
    logo: {
        width: 250,
        height: 50,
        resizeMode: "contain",
        alignSelf: "center",
        marginBottom: 18,
    },

    // container style to display the logo smaller and to the left
    logoSmall: {
        width: 200,
        height: 30,
        resizeMode: "contain",
        alignSelf: "flex-start",
    },

    //******** CONTAINER STYLES FOR CARDS, BUTTONS, INPUTS etc. *********// 

    // small square container style with round edges, used for buttons etc.
    square: {
        borderWidth: 1,
        borderRadius: 8,     
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
    },

    // oblong container style used for form buttons (autofill, clear), meal type tags etc.
    oval: {
        flexDirection: "row",
        gap: 5,
        borderWidth: 1,
        borderRadius: 999,
        paddingVertical: 5,
        paddingHorizontal: 10,
        margin: 2,
        alignItems: "center",
        justifyContent: 'center',
        alignSelf: 'flex-end'
    },

    // smaller oblong container style 
    smallOval: {
        flexDirection: "row",
        gap: 3,
        borderRadius: 999,
        paddingVertical: 4,
        paddingHorizontal: 8,
        alignItems: "center",
    },
  
    // container style used for biggest buttons e.g. login
    bigPurpleButton: {
        flexDirection: "row",
        gap: 8,
        borderRadius: 10,
        backgroundColor: "#5525beff",
        padding: 10,
        marginVertical: 5,
        alignItems: "center",
        justifyContent: "center",
    },

    // container style used for boxes with round edges e.g. cards, input boxes
    box: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginVertical:5,
    },

    // rectangular style used for small inputs e.g. nutrient input in filter section
    smallNutrientInput: {
        borderWidth: 1,
        borderRadius: 4,
        padding: 4,
        margin:4,
        width: 60,
    },

    // style used for table rows with a bottom border e.g. nutrition results table
    nutritionRow: {
        borderBottomWidth: 1,
        borderBottomColor: "#efe9ff",
        paddingVertical: 2,
        alignItems: 'center'
    },

    //******** CONTAINER COLOUR COMBINATIONS *********// 

    // style used for buttons with red borders e.g. delete 
    redBorderBtn: { borderColor: "#fd8484ff" },

    // style used for buttons with blue borders e.g. download
    blueBorderBtn: { borderColor: "#65a9f3ff" },

    // style used for buttons with green borders e.g. save
    greenBorderBtn: { borderColor: "#59bd50ff" },

    // style used for buttons with yellow borders e.g. reset
    yellowBorderBtn: { borderColor: "#d6d319ff" },

    // style used for buttons with red background, e.g. logout
    redButton: { backgroundColor: "#fd8484ff" },

    // white background with light purple border, used mostly for input fields
    whiteContainer: {
        backgroundColor: "#fff",
        borderColor: "#d7cbff",
    },

    // light purple background with light purple border, used mostly for forms
    lightPurpleContainer: {
        backgroundColor: "#efe9ff",
        borderColor: "#d7cbff",
    },

    // darker purple background, used mostly in information cards
    darkPurpleContainer: {
        backgroundColor: "#dfcdffff",
        borderColor: "#dfcdffff",
    },

    // light red background with light red border
    lightRedContainer: {
        backgroundColor: "#ffe1e1ff", 
        borderColor: "#ffc3c3ff" 
    },

    //******** TEXT STYLES *********// 

    // smallest light grey text for disclaimers, timestamps etc.
    smallestText: {
        color: "#666",
        fontSize: 12,
        textAlign: 'justify',
    },

    // small black bold text for buttons etc
    smallBoldBlack: { 
        fontSize: 12, 
        fontWeight: "600" 
    },

    // small white bold text for buttons etc.
    smallBoldWhite: {
        fontSize: 12, 
        fontWeight: "600", 
        color: 'white'
    },
  
    // small grey text for table values etc.
    tableValues: { 
        fontSize: 14, 
        color: "#555", 
        textAlign: 'justify'
    },

    // small grey bold text for table headings etc.
    tableHeadings: {
        fontSize: 14, 
        color: "#555", 
        textAlign: 'justify',
        fontWeight:700,
    },

    // small dark purple bold text 
    purpleText: { 
        color: "#5525beff", 
        fontWeight:700,
        fontSize: 14 
    },

    // bold text for section headings etc.
    sectionHeadings: { 
        fontSize: 16, 
        fontWeight: 700, 
        marginBottom:5
    },
  
    // large bold text for screen titles
    title: { 
        fontSize: 22, 
        fontWeight: "bold" 
    },

    // bold white text for biggest dark purple buttons
    biggestButtonText: { 
        color: "#fff", 
        fontWeight: "800", 
        fontSize: 17 
    },

    // smaller bold white text for second largest dark purple buttons
    secondButtonText: { 
        color: "#fff", 
        fontWeight: "700",
        fontSize: 15
    },
});

