const Route = require("../models/route");
const Bus = require("../models/bus");
const Booking = require("../models/booking");

const DEMO_ROUTES = {
  "delhi|jaipur": {
    route: {
      _id: "demo-route-delhi-jaipur",
      departureLocation: {
        name: "Delhi",
        subLocations: ["Kashmere Gate", "Majnu Ka Tila", "RK Ashram"]
      },
      arrivalLocation: {
        name: "Jaipur",
        subLocations: ["Sindhi Camp", "Narayan Singh Circle", "Tonk Road"]
      },
      duration: 6
    },
    buses: [
      {
        _id: "demo-bus-delhi-jaipur-1",
        operatorName: "Royal Travels",
        busType: "A/C Seater",
        departureTime: "06",
        arrivalTime: "12",
        rating: [4, 5, 4, 5],
        totalSeats: 40,
        routes: "demo-route-delhi-jaipur",
        images: "assets/bus1.png",
        liveTracking: 1,
        reschedulable: 1
      },
      {
        _id: "demo-bus-delhi-jaipur-2",
        operatorName: "City Express",
        busType: "sleeper",
        departureTime: "21",
        arrivalTime: "03",
        rating: [4, 4, 5],
        totalSeats: 40,
        routes: "demo-route-delhi-jaipur",
        images: "assets/bus2.png",
        liveTracking: 1,
        reschedulable: 0
      }
    ]
  },
  "mumbai|goa": {
    route: {
      _id: "demo-route-mumbai-goa",
      departureLocation: {
        name: "Mumbai",
        subLocations: ["Borivali", "Dadar", "Sion"]
      },
      arrivalLocation: {
        name: "Goa",
        subLocations: ["Mapusa", "Panaji", "Madgaon"]
      },
      duration: 11
    },
    buses: [
      {
        _id: "demo-bus-mumbai-goa-1",
        operatorName: "Konkan Travels",
        busType: "sleeper",
        departureTime: "18",
        arrivalTime: "05",
        rating: [5, 4, 4, 5],
        totalSeats: 40,
        routes: "demo-route-mumbai-goa",
        images: "assets/bus3.png",
        liveTracking: 1,
        reschedulable: 1
      },
      {
        _id: "demo-bus-mumbai-goa-2",
        operatorName: "Sea Breeze Bus",
        busType: "Non A/C",
        departureTime: "20",
        arrivalTime: "07",
        rating: [4, 3, 4],
        totalSeats: 40,
        routes: "demo-route-mumbai-goa",
        images: "assets/bus4.png",
        liveTracking: 0,
        reschedulable: 1
      }
    ]
  },
  "bangalore|mysore": {
    route: {
      _id: "demo-route-bangalore-mysore",
      departureLocation: {
        name: "Bangalore",
        subLocations: ["Majestic", "Satellite Bus Stand", "Electronic City"]
      },
      arrivalLocation: {
        name: "Mysore",
        subLocations: ["Mysore Bus Stand", "Suburban", "Nazarbad"]
      },
      duration: 4
    },
    buses: [
      {
        _id: "demo-bus-bangalore-mysore-1",
        operatorName: "Karnataka Express",
        busType: "standard",
        departureTime: "07",
        arrivalTime: "11",
        rating: [4, 4, 4],
        totalSeats: 40,
        routes: "demo-route-bangalore-mysore",
        images: "assets/bus1.png",
        liveTracking: 1,
        reschedulable: 1
      },
      {
        _id: "demo-bus-bangalore-mysore-2",
        operatorName: "Green Line",
        busType: "A/C Seater",
        departureTime: "16",
        arrivalTime: "20",
        rating: [5, 4, 5],
        totalSeats: 40,
        routes: "demo-route-bangalore-mysore",
        images: "assets/bus2.png",
        liveTracking: 1,
        reschedulable: 1
      }
    ]
  },
  "kolkata|darjeeling": {
    route: {
      _id: "demo-route-kolkata-darjeeling",
      departureLocation: {
        name: "Kolkata",
        subLocations: ["Esplanade", "Howrah", "Karunamoyee"]
      },
      arrivalLocation: {
        name: "Darjeeling",
        subLocations: ["Ghoom", "Darjeeling Town", "Chowrasta"]
      },
      duration: 12
    },
    buses: [
      {
        _id: "demo-bus-kolkata-darjeeling-1",
        operatorName: "Himalayan Rider",
        busType: "sleeper",
        departureTime: "19",
        arrivalTime: "07",
        rating: [4, 5, 4],
        totalSeats: 40,
        routes: "demo-route-kolkata-darjeeling",
        images: "assets/bus3.png",
        liveTracking: 1,
        reschedulable: 0
      },
      {
        _id: "demo-bus-kolkata-darjeeling-2",
        operatorName: "North Bengal Express",
        busType: "Non A/C",
        departureTime: "20",
        arrivalTime: "08",
        rating: [3, 4, 4],
        totalSeats: 40,
        routes: "demo-route-kolkata-darjeeling",
        images: "assets/bus4.png",
        liveTracking: 0,
        reschedulable: 1
      }
    ]
  },
  "chennai|pondicherry": {
    route: {
      _id: "demo-route-chennai-pondicherry",
      departureLocation: {
        name: "Chennai",
        subLocations: ["Koyambedu", "Guindy", "Tambaram"]
      },
      arrivalLocation: {
        name: "Pondicherry",
        subLocations: ["New Bus Stand", "Ariyankuppam", "Beach Road"]
      },
      duration: 4
    },
    buses: [
      {
        _id: "demo-bus-chennai-pondicherry-1",
        operatorName: "East Coast Travels",
        busType: "A/C Seater",
        departureTime: "08",
        arrivalTime: "12",
        rating: [4, 4, 5],
        totalSeats: 40,
        routes: "demo-route-chennai-pondicherry",
        images: "assets/bus1.png",
        liveTracking: 1,
        reschedulable: 1
      },
      {
        _id: "demo-bus-chennai-pondicherry-2",
        operatorName: "Pondy Express",
        busType: "standard",
        departureTime: "17",
        arrivalTime: "21",
        rating: [4, 3, 4],
        totalSeats: 40,
        routes: "demo-route-chennai-pondicherry",
        images: "assets/bus2.png",
        liveTracking: 1,
        reschedulable: 1
      }
    ]
  }
};

function getDemoRouteBundle(departure, arrival) {
  const key = `${String(departure).trim().toLowerCase()}|${String(arrival).trim().toLowerCase()}`;
  return DEMO_ROUTES[key] || null;
}

async function buildSeatMap(buses, date) {
  const booking = await Booking.find().lean().exec();
  const busidwithseatobj = {};

  for (let i = 0; i < buses.length; i++) {
    let currentbusseats = [];

    const busbooking = booking.filter((entry) => {
      return (
        entry.departureDetails?.date === date &&
        entry.busId?.toString() === buses[i]._id.toString()
      );
    });

    busbooking.forEach((entry) => {
      currentbusseats = [...currentbusseats, ...(entry.seats || [])];
    });

    busidwithseatobj[buses[i]._id.toString()] = currentbusseats;
  }

  return busidwithseatobj;
}

exports.getoneroute = async (req, res) => {
  try {
    const departure = req.params.departure;
    const arrival = req.params.arrival;
    const date = req.params.date;

    const routes = await Route.find().lean().exec();

    const route = routes.find((routeItem) => {
      return (
        routeItem.departureLocation?.name?.toLowerCase() === departure.toLowerCase() &&
        routeItem.arrivalLocation?.name?.toLowerCase() === arrival.toLowerCase()
      );
    });

    const buses = await Bus.find().lean().exec();

    let matchedBuses = route
      ? buses.filter((bus) => bus.routes?.toString() === route._id.toString())
      : [];

    if (!route || !matchedBuses.length) {
      const demoBundle = getDemoRouteBundle(departure, arrival);

      if (demoBundle) {
        const busidwithseatobj = await buildSeatMap(demoBundle.buses, date);
        return res.json({
          route: demoBundle.route,
          matchedBuses: demoBundle.buses,
          busidwithseatobj,
          isDemoData: true
        });
      }

      if (!route) {
        return res.status(404).json({ message: "Route not found" });
      }
    }

    const busidwithseatobj = await buildSeatMap(matchedBuses, date);

    res.json({
      route,
      matchedBuses,
      busidwithseatobj
    });
  } catch (error) {
    console.error("Route API error:", error);
    res.status(500).json({ message: error.message });
  }
};
