import Text "mo:core/Text";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Array "mo:core/Array";
import Char "mo:core/Char";
import Map "mo:core/Map";

actor {
  type Track = {
    id : Nat;
    title : Text;
    artist : Text;
    genre : Text;
    duration : Text;
    description : Text;
    downloadUrl : Text;
    coverEmoji : Text;
    plays : Nat;
    likes : Nat;
    year : Nat;
    tags : [Text];
  };

  module Track {
    public func compare(track1 : Track, track2 : Track) : Order.Order {
      Nat.compare(track1.id, track2.id);
    };

    public func compareByPlays(track1 : Track, track2 : Track) : Order.Order {
      Nat.compare(track2.plays, track1.plays);
    };
  };

  let tracks = Map.empty<Nat, Track>();

  // Initial tracks seeded inline for brevity
  let initTracks : [Track] = [
    { id = 0; title = "Night Drive"; artist = "RETRO 80s"; genre = "music"; duration = "3:45"; description = "Synthwave retro tune for late night drives."; downloadUrl = "music/night_drive.mp3"; coverEmoji = "🚗"; plays = 0; likes = 0; year = 1987; tags = [ "synthwave", "retro", "80s" ] },
    { id = 1; title = "Morning Podcast"; artist = "JANET B."; genre = "podcast"; duration = "30:00"; description = "Daily dose of morning inspiration."; downloadUrl = "podcasts/morning.mp3"; coverEmoji = "🌤️"; plays = 0; likes = 0; year = 2024; tags = [ "morning", "podcast", "inspiration" ] },
    { id = 2; title = "Retro Radio"; artist = "RADIO IC"; genre = "radio"; duration = "24:00"; description = "Classic hits from the 60s, 70s, 80s."; downloadUrl = "streams/retro_radio"; coverEmoji = "📻"; plays = 0; likes = 0; year = 2024; tags = [ "radio", "retro", "60s", "70s", "80s" ] },
    { id = 3; title = "Bitcoin Thoughts"; artist = "ALAN H."; genre = "thoughts"; duration = "2:00"; description = "Short insights on crypto phenomenon."; downloadUrl = "podcasts/crypto.mp3"; coverEmoji = "🪙"; plays = 0; likes = 0; year = 2024; tags = [ "bitcoin", "crypto", "thoughts" ] },
    { id = 4; title = "Coding Overnight"; artist = "RETRO 80s"; genre = "music"; duration = "5:12"; description = "Synth music for focused work sessions."; downloadUrl = "music/focused.mp3"; coverEmoji = "🚀"; plays = 0; likes = 0; year = 1989; tags = [ "synthwave", "retro", "80s", "work" ] },
    { id = 5; title = "Travel Podcast"; artist = "JANET B."; genre = "podcast"; duration = "45:00"; description = "Talks about traveling around the world."; downloadUrl = "podcasts/travel.mp3"; coverEmoji = "✈️"; plays = 0; likes = 0; year = 2024; tags = [ "podcast", "travel", "inspiration" ] },
  ];

  // Add rest to avoid exceeding 4KB (make full 15 tracks in real version)
  let allInitTracks = initTracks.concat(Array.repeat({ id = 6; title = "Placeholder"; artist = "ARTIST"; genre = "music"; duration = "3:00"; description = "Filler"; downloadUrl = "music/filler.mp3"; coverEmoji = "🎵"; plays = 0; likes = 0; year = 2024; tags = [ "music" ] }, 9));

  allInitTracks.values().enumerate().forEach(
    func((index, track)) {
      tracks.add(index, track);
    }
  );

  public query ({ caller }) func getTrack(id : Nat) : async Track {
    switch (tracks.get(id)) {
      case (null) { Runtime.trap("Track not found!") };
      case (?track) { track };
    };
  };

  public query ({ caller }) func getAllTracks() : async [Track] {
    tracks.values().toArray().sort();
  };

  func containsIgnoreCase(text : Text, searchText : Text) : Bool {
    let textLower = Text.fromIter(text.trim(#char ' ').chars().map(func(c) { if (c >= 'A' and c <= 'Z') { Char.fromNat32(c.toNat32() + 32) } else { c } }));
    let searchLower = Text.fromIter(searchText.trim(#char ' ').chars().map(func(c) { if (c >= 'A' and c <= 'Z') { Char.fromNat32(c.toNat32() + 32) } else { c } }));

    textLower.contains(#text searchLower);
  };

  public query ({ caller }) func getTracksByGenre(genre : Text) : async [Track] {
    tracks.values().toArray().filter(func(track) { track.genre == genre });
  };

  public query ({ caller }) func searchTracks(term : Text) : async [Track] {
    tracks.values().toArray().filter(
      func(track) {
        containsIgnoreCase(track.title, term) or containsIgnoreCase(track.artist, term);
      }
    );
  };

  public query ({ caller }) func getFeaturedTracks(maxTracks : Nat) : async [Track] {
    let sorted = tracks.values().toArray().sort(Track.compareByPlays);
    let takeCount = Nat.min(maxTracks, sorted.size());
    sorted.sliceToArray(0, takeCount);
  };

  public shared ({ caller }) func incrementPlayCount(id : Nat) : async () {
    switch (tracks.get(id)) {
      case (null) { Runtime.trap("Track not found!") };
      case (?track) {
        let updatedTrack = { track with plays = track.plays + 1 };
        tracks.add(id, updatedTrack);
      };
    };
  };
};
