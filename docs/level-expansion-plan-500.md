# Level Expansion Plan to 500

## Snapshot

- Current playable levels: `153`
- Story-covered levels today: `44`
- New levels required to reach `500`: `347`
- Current story endpoint: level `153`, party is approaching the Hostess arc

Primary source files:

- `src/core/configuration/ForestConfiguration.ts`
- `src/core/configuration/ReplicasConfiguration.ts`
- `src/core/configuration/ForestReplicasConfiguration.ts`

## Story Pitch 154-500

- `154-180`: reach the Snow Ridge and meet the Hostess. Existing `yaga1-3` art can carry this reveal.
- `181-220`: Boris once had to deliver a route-key / seed-map to the Hostess. That task ties memory loss to broken roads.
- `221-260`: the squirrel becomes a courier ally and route-fragment guide.
- `261-300`: restore three path anchors: Owl route, Mill wheel, Root lantern.
- `301-350`: introduce the Fog of Forgetfulness as a soft magical threat, not a classic villain.
- `351-420`: return-tour arc across known places, reconnecting roads and allies.
- `421-470`: Boris recovers the real delivery object: a living map-seed for the Hostess.
- `471-500`: finale via rebuilding, reunion, and festival rather than boss combat.

Suggested story checkpoints:

- `154`, `160`, `167`, `175`, `184`, `193`, `202`, `212`
- `223`, `235`, `248`, `260`, `273`, `286`, `300`, `315`
- `330`, `345`, `360`, `375`, `390`, `405`, `420`, `435`
- `450`, `470`, `485`, `500`

## New Locations

- Snow Pass
- Crystal Ravine
- Ice Observatory
- Root Road
- Night Greenhouse
- Moon Pier
- Owl Post Nests
- Mill Backwater
- Moss Amphitheater
- Fair by the Hut

## New Minigame Biomes

- Frost Ridge
- Crystal Scree
- Bog Moss
- Night Garden
- Root Maze

## New Characters

- Hostess / Yaga using `yaga1-3`
- Squirrel Courier
- Raven Archivist
- Otter Miller
- Badger Herbalist
- Moth Lamplighter

## Safe Variation Rules

- Wave A (`154-306`): donor clone + soft reskin + one simple mask replacement + small steps increase.
- Wave B (`307-459`): donor clone + stronger reskin + one more visible mask replacement + small steps decrease.
- Wave C (`460-500`): extra endgame wave from safer donors only, with stronger target swaps and `+2` steps.
- Keep the donor main mechanic if present: `flowers`, `cankerberries`, `ladybugs`, `acorns`, `honey`, `jelly`, `dragonflies`, `interactiveItems`, `separators`.
- If the table says `t24->t24`, `t25->t25`, `t27->t27`, or `t1->t1`, keep the chapter item and differentiate via mask, steps, and support targets.
- For `house` / `hexChest` donors, biome-like mask notes mean safe neutral-cell reskin inside the same house logic.

## Full Level Plan

### Wave A: 154-306

154. donor 1; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom->lavanda; mask edge g->1; steps 10->11; keep no extra mechanics.
155. donor 3; env house->house; leaf hexChest->hexChest; keep randomItems 5, retheme reward pool; mask edge g->1; steps 10->11; keep randomItems.
156. donor 27; env forest->flowerFields; leaf leaf1->leaf3; goals lavanda->mushroom3; mask add a few l over neutral cells; steps 17->18; keep ladybugs, keep hard pacing.
157. donor 2; env forest->flowerFields; leaf leaf4->leaf1; goals mushroom->lavanda; mask edge g->1; steps 8->9; keep no extra mechanics.
158. donor 4; env house->house; leaf hexChest->hexChest; keep randomItems 6, retheme reward pool; mask edge g->1; steps 10->11; keep randomItems.
159. donor 35; env darkForest->forest; leaf leaf1->leaf3; goals witchMushroom->amanita; mask edge g->1; steps 12->13; keep jelly, keep dragonflies.
160. donor 5; env jungles->snailForest; leaf leaf1->leaf3; goals mushroom->lavanda; mask edge g->1; steps 9->10; keep no extra mechanics.
161. donor 8; env snailForest->jungles; leaf leaf3->leaf4; goals mushroom->lavanda; mask edge g->1; steps 7->8; keep dragonflies.
162. donor 43; env darkForest->forest; leaf leaf4->leaf1; goals witchMushroom->amanita; mask edge g->1; steps 11->12; keep acorns, keep hard pacing.
163. donor 6; env jungles->snailForest; leaf leaf4->leaf1; goals mushroom3->lilly; mask edge g->1; steps 11->12; keep no extra mechanics.
164. donor 9; env bugForest->snailForest; leaf leaf4->leaf1; keep empty-target pacing with bonus driven reveal; mask edge g->1; steps 9->10; keep ladybugs.
165. donor 51; env forest->flowerFields; leaf leaf4->leaf1; goals mushroom3->lilly; mask edge g->1; steps 9->10; keep flowers, keep dragonflies, keep hard pacing.
166. donor 7; env snailForest->jungles; leaf leaf1->leaf3; goals mushroom->lavanda, witchMushroom->amanita; mask edge g->1; steps 10->11; keep no extra mechanics.
167. donor 10; env bugForest->snailForest; leaf leaf1->leaf3; goals mushroom->lavanda; mask edge g->1; steps 10->11; keep ladybugs.
168. donor 57; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom->lavanda, witchMushroom->amanita; mask edge g->1; steps 11->12; keep honey, keep dragonflies.
169. donor 11; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom->lavanda, mushroom3->lilly; mask edge g->1; steps 10->11; keep no extra mechanics.
170. donor 12; env forest->flowerFields; leaf leaf3->leaf4; keep empty-target pacing with bonus driven reveal; mask edge g->1; steps 8->9; keep flowers.
171. donor 58; env forest->flowerFields; leaf leaf3->leaf4; goals lavanda->mushroom3, witchMushroom->amanita; mask edge g->1; steps 10->11; keep honey, keep dragonflies.
172. donor 14; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom3->lilly; mask edge g->1; steps 10->11; keep no extra mechanics.
173. donor 13; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom->lavanda; mask edge g->1; steps 14->15; keep flowers.
174. donor 68; env house->house; leaf hexChest->hexChest; keep randomItems 12, retheme reward pool; mask edge g->1; steps 13->14; keep dragonflies, keep randomItems.
175. donor 15; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom3->lilly, lilly->mushroom; mask edge g->1; steps 9->10; keep no extra mechanics.
176. donor 17; env forest->flowerFields; leaf leaf4->leaf1; goals mushroom3->lilly; mask edge g->1; steps 12->13; keep ladybugs.
177. donor 69; env house->house; leaf hexChest->hexChest; keep randomItems 9, retheme reward pool; mask edge g->1; steps 7->8; keep dragonflies, keep randomItems.
178. donor 16; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom3->lilly, lilly->mushroom; mask edge g->1; steps 6->7; keep no extra mechanics.
179. donor 18; env forest->flowerFields; leaf leaf1->leaf3; goals lilly->mushroom, mushroom->lavanda; mask edge g->1; steps 11->12; keep ladybugs.
180. donor 71; env house->house; leaf hexChest->hexChest; keep randomItems 6, retheme reward pool; mask edge g->1; steps 9->10; keep dragonflies, keep randomItems.
181. donor 19; env forest->flowerFields; leaf leaf4->leaf1; keep empty-target pacing with bonus driven reveal; mask edge g->1; steps 11->12; keep no extra mechanics.
182. donor 24; env forest->flowerFields; leaf leaf1->leaf3; goals lavanda->mushroom3, witchMushroom->amanita; mask edge g->1; steps 11->12; keep cankerberries.
183. donor 73; env house->house; leaf hexChest->hexChest; keep randomItems 12, retheme reward pool; mask edge g->1; steps 9->10; keep dragonflies, keep randomItems, keep hard pacing.
184. donor 20; env forest->flowerFields; leaf leaf3->leaf4; goals mushroom->lavanda; mask edge g->1; steps 9->10; keep no extra mechanics.
185. donor 28; env forest->flowerFields; leaf leaf1->leaf3; goals witchMushroom->amanita; mask edge g->1; steps 14->15; keep cankerberries.
186. donor 80; env forest->flowerFields; leaf leaf4->leaf1; goals witchMushroom->amanita; mask edge g->1; steps 8->9; keep acorns, keep honey, keep dragonflies.
187. donor 21; env forest->flowerFields; leaf leaf4->leaf1; goals witchMushroom->amanita, lilly->mushroom; mask edge g->1; steps 7->8; keep no extra mechanics.
188. donor 31; env forest->flowerFields; leaf leaf1->leaf3; goals witchMushroom->amanita, lilly->mushroom; mask edge g->1; steps 11->12; keep cankerberries.
189. donor 85; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom->lavanda; mask edge g->1; steps 10->11; keep cankerberries, keep dragonflies, do not touch separators.
190. donor 22; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom->lavanda, lavanda->mushroom3; mask some i->l; steps 10->11; keep no extra mechanics.
191. donor 36; env darkForest->forest; leaf leaf4->leaf1; goals witchMushroom->amanita; mask edge g->1; steps 12->13; keep jelly.
192. donor 86; env forest->flowerFields; leaf leaf1->leaf3; goals lavanda->mushroom3, goldRoot->amber; mask edge g->1; steps 8->9; keep dragonflies, do not touch separators.
193. donor 23; env forest->flowerFields; leaf leaf3->leaf4; goals mushroom3->lilly, lavanda->mushroom3; mask edge g->1; steps 14->15; keep no extra mechanics.
194. donor 37; env darkForest->forest; leaf leaf4->leaf1; goals witchMushroom->amanita, lilly->mushroom; mask edge g->1; steps 12->13; keep hard pacing.
195. donor 87; env forest->flowerFields; leaf leaf1->leaf3; goals goldRoot->amber; mask edge g->1; steps 7->8; keep honey, keep dragonflies, do not touch separators.
196. donor 25; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom3->lilly, lavanda->mushroom3; mask edge g->1; steps 13->14; keep no extra mechanics.
197. donor 38; env darkForest->forest; leaf leaf4->leaf1; goals witchMushroom->amanita; mask edge g->1; steps 11->12; keep acorns.
198. donor 88; env forest->flowerFields; leaf leaf4->leaf1; goals witchMushroom->amanita, lavanda->mushroom3; mask edge g->1; steps 14->15; keep acorns, keep hard pacing.
199. donor 26; env forest->flowerFields; leaf leaf4->leaf1; goals mushroom3->lilly, lilly->mushroom; mask edge g->1; steps 13->14; keep no extra mechanics.
200. donor 39; env darkForest->forest; leaf leaf4->leaf1; goals mushroom->lavanda, witchMushroom->amanita; mask edge g->1; steps 10->11; keep acorns.
201. donor 90; env forest->flowerFields; leaf leaf4->leaf1; goals witchMushroom->amanita, goldRoot->amber; mask edge g->1; steps 10->11; keep acorns, keep dragonflies.
202. donor 29; env forest->flowerFields; leaf leaf1->leaf3; goals lilly->mushroom; mask edge g->1; steps 15->16; keep no extra mechanics.
203. donor 42; env darkForest->forest; leaf leaf3->leaf4; goals mushroom3->lilly; mask edge g->1; steps 11->12; keep cankerberries.
204. donor 93; env lake->flowerFields; leaf leaf4->leaf1; keep interactiveItems, swap only secondary reward target; mask edge g->1; steps 10->11; keep dragonflies, do not touch interactiveItems.
205. donor 30; env forest->flowerFields; leaf leaf1->leaf3; goals lavanda->mushroom3, mushroom->lavanda; mask edge g->1; steps 8->9; keep no extra mechanics.
206. donor 45; env forest->flowerFields; leaf leaf4->leaf1; goals mushroom3->lilly, mushroom->lavanda; mask edge g->1; steps 10->11; keep acorns.
207. donor 94; env lake->flowerFields; leaf leaf1->leaf3; keep interactiveItems, swap only secondary reward target; mask add a few l over neutral cells; steps 8->9; keep dragonflies, do not touch interactiveItems.
208. donor 32; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom->lavanda; mask edge g->1; steps 15->16; keep no extra mechanics.
209. donor 46; env forest->flowerFields; leaf leaf4->leaf1; goals lilly->mushroom; mask edge g->1; steps 14->15; keep acorns.
210. donor 95; env lake->flowerFields; leaf leaf1->leaf3; keep interactiveItems, swap only secondary reward target; mask add a few l over neutral cells; steps 7->8; keep dragonflies, do not touch interactiveItems.
211. donor 33; env darkForest->forest; leaf leaf3->leaf4; goals witchMushroom->amanita, amanita->witchMushroom; mask edge g->1; steps 12->13; keep no extra mechanics.
212. donor 50; env forest->flowerFields; leaf leaf4->leaf1; goals mushroom->lavanda, witchMushroom->amanita; mask edge g->1; steps 11->12; keep cankerberries.
213. donor 96; env lake->flowerFields; leaf leaf1->leaf3; keep interactiveItems, swap only secondary reward target; mask edge g->1; steps 10->11; keep dragonflies, do not touch interactiveItems.
214. donor 34; env darkForest->forest; leaf leaf4->leaf1; goals lilly->mushroom, mushroom->lavanda; mask edge g->1; steps 10->11; keep no extra mechanics.
215. donor 53; env forest->flowerFields; leaf leaf1->leaf3; goals lavanda->mushroom3, lilly->mushroom; mask edge g->1; steps 9->10; keep cankerberries.
216. donor 97; env lake->flowerFields; leaf leaf1->leaf3; keep interactiveItems, swap only secondary reward target; mask add a few l over neutral cells; steps 8->9; keep dragonflies, do not touch interactiveItems.
217. donor 40; env darkForest->forest; leaf leaf4->leaf1; goals mushroom->lavanda, mushroom3->lilly; mask edge g->1; steps 7->8; keep no extra mechanics.
218. donor 54; env forest->flowerFields; leaf leaf1->leaf3; goals lavanda->mushroom3, lilly->mushroom; mask edge g->1; steps 10->11; keep ladybugs.
219. donor 98; env lake->flowerFields; leaf leaf3->leaf4; keep interactiveItems, swap only secondary reward target; mask add a few l over neutral cells; steps 11->12; keep dragonflies, do not touch interactiveItems.
220. donor 41; env darkForest->forest; leaf leaf1->leaf3; goals mushroom->lavanda, witchMushroom->amanita; mask edge g->1; steps 7->8; keep no extra mechanics.
221. donor 56; env forest->flowerFields; leaf leaf1->leaf3; goals lilly->mushroom; mask some i->l; steps 9->10; keep cankerberries.
222. donor 104; env forest->flowerFields; leaf leaf3->leaf4; goals wheat->lavanda, witchMushroom->amanita; mask edge g->1; steps 10->11; keep cankerberries, keep dragonflies, keep hard pacing.
223. donor 44; env darkForest->forest; leaf leaf1->leaf3; goals lilly->mushroom, witchMushroom->amanita; mask edge g->1; steps 9->10; keep no extra mechanics.
224. donor 59; env forest->flowerFields; leaf leaf4->leaf1; goals mushroom->lavanda; mask edge g->1; steps 14->15; keep dragonflies.
225. donor 108; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom->lavanda; mask edge g->1; steps 6->7; keep honey, keep dragonflies.
226. donor 47; env forest->flowerFields; leaf leaf1->leaf3; goals poleno->goldRoot; mask edge g->1; steps 10->11; keep no extra mechanics.
227. donor 60; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom3->lilly, lavanda->mushroom3; mask edge g->1; steps 15->16; keep hard pacing.
228. donor 109; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom->lavanda; mask edge g->1; steps 11->12; keep flowers, keep dragonflies.
229. donor 48; env forest->flowerFields; leaf leaf3->leaf4; goals lavanda->mushroom3, lilly->mushroom; mask edge g->1; steps 9->10; keep no extra mechanics.
230. donor 61; env forest->flowerFields; leaf leaf3->leaf4; goals mushroom->lavanda, mushroom3->lilly; mask edge g->1; steps 7->8; keep dragonflies.
231. donor 112; env forest->flowerFields; leaf leaf1->leaf3; keep interactiveItems, swap only secondary reward target; mask add a few l over neutral cells; steps 14->15; keep dragonflies, do not touch interactiveItems.
232. donor 49; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom->lavanda, lavanda->mushroom3; mask edge g->1; steps 8->9; keep no extra mechanics.
233. donor 62; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom->lavanda; mask edge g->1; steps 8->9; keep dragonflies.
234. donor 114; env forest->flowerFields; leaf leaf4->leaf1; goals goldRoot->amber; mask edge g->1; steps 14->15; keep honey, keep dragonflies.
235. donor 52; env forest->flowerFields; leaf leaf3->leaf4; goals mushroom->lavanda, lilly->mushroom; mask edge g->1; steps 8->9; keep no extra mechanics.
236. donor 65; env house->house; leaf hexChest->hexChest; keep randomItems 9, retheme reward pool; mask edge g->1; steps 9->10; keep randomItems.
237. donor 115; env lake->flowerFields; leaf leaf1->leaf3; keep interactiveItems, swap only secondary reward target; mask edge g->1; steps 7->8; keep dragonflies, do not touch interactiveItems.
238. donor 55; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom->lavanda, lilly->mushroom; mask edge g->1; steps 10->11; keep no extra mechanics.
239. donor 66; env house->house; leaf hexChest->hexChest; keep randomItems 6, retheme reward pool; mask edge g->1; steps 8->9; keep randomItems.
240. donor 118; env lake->flowerFields; leaf leaf1->leaf3; keep interactiveItems, swap only secondary reward target; mask add a few l over neutral cells; steps 7->8; keep dragonflies, do not touch interactiveItems.
241. donor 63; env forest->flowerFields; leaf leaf1->leaf3; goals lavanda->mushroom3, lilly->mushroom; mask add a few l over neutral cells; steps 7->8; keep no extra mechanics.
242. donor 67; env house->house; leaf hexChest->hexChest; keep randomItems 12, retheme reward pool; mask edge g->1; steps 8->9; keep randomItems.
243. donor 120; env darkForest->forest; leaf leaf1->leaf3; keep interactiveItems, swap only secondary reward target; mask add a few l over neutral cells; steps 11->12; keep dragonflies, do not touch interactiveItems.
244. donor 64; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom->lavanda; mask some i->l; steps 10->11; keep no extra mechanics.
245. donor 70; env house->house; leaf hexChest->hexChest; keep randomItems 7, retheme reward pool; mask edge g->1; steps 6->7; keep randomItems.
246. donor 122; env darkForest->forest; leaf leaf4->leaf1; goals mushroom->lavanda; mask edge g->1; steps 16->17; keep acorns, keep dragonflies.
247. donor 74; env house->house; leaf hexChest->hexChest; goals t25->t25; mask edge g->1; steps 11->12; keep no extra mechanics.
248. donor 72; env house->house; leaf hexChest->hexChest; keep randomItems 10, retheme reward pool; mask edge g->1; steps 15->16; keep randomItems.
249. donor 126; env darkForest->forest; leaf leaf4->leaf1; goals witchMushroom->amanita; mask edge g->1; steps 13->14; keep cankerberries, keep dragonflies.
250. donor 78; env house->house; leaf hexChest->hexChest; goals t24->t24; mask edge g->1; steps 10->11; keep no extra mechanics.
251. donor 75; env house->house; leaf hexChest->hexChest; goals t1->t1; mask edge g->1; steps 9->10; keep honey.
252. donor 128; env darkForest->forest; leaf leaf1->leaf3; goals mushroom3->lilly; mask edge g->1; steps 9->10; keep honey, keep dragonflies.
253. donor 79; env forest->flowerFields; leaf leaf1->leaf3; goals lavanda->mushroom3, mushroom4->mushroom5; mask edge g->1; steps 9->10; keep no extra mechanics.
254. donor 76; env house->house; leaf hexChest->hexChest; keep randomItems 10, retheme reward pool; mask edge g->1; steps 8->9; keep randomItems.
255. donor 129; env darkForest->forest; leaf leaf1->leaf3; keep interactiveItems, swap only secondary reward target; mask edge g->1; steps 8->9; keep cankerberries, keep dragonflies, do not touch interactiveItems.
256. donor 83; env forest->flowerFields; leaf leaf1->leaf3; goals witchMushroom->amanita; mask edge g->1; steps 10->11; keep no extra mechanics.
257. donor 77; env house->house; leaf hexChest->hexChest; goals t27->t27; mask edge g->1; steps 6->7; keep hard pacing.
258. donor 130; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom->lavanda, witchMushroom->amanita; mask edge g->1; steps 6->7; keep acorns, keep hard pacing.
259. donor 84; env forest->flowerFields; leaf leaf1->leaf3; goals lavanda->mushroom3, lilly->mushroom; mask add a few l over neutral cells; steps 8->9; keep no extra mechanics.
260. donor 81; env forest->flowerFields; leaf leaf1->leaf3; goals lilly->mushroom, mushroom3->lilly; mask edge g->1; steps 11->12; keep dragonflies.
261. donor 131; env forest->flowerFields; leaf leaf1->leaf3; goals lilly->mushroom, amanita->witchMushroom; mask edge g->1; steps 12->13; keep dragonflies, keep hard pacing.
262. donor 91; env forest->flowerFields; leaf leaf4->leaf1; goals lilly->mushroom, goldRoot->amber; mask edge g->1; steps 16->17; keep no extra mechanics.
263. donor 82; env forest->flowerFields; leaf leaf1->leaf3; goals lavanda->mushroom3, mushroom4->mushroom5; mask some i->l; steps 6->7; keep dragonflies.
264. donor 136; env flowerFields->forest; leaf leaf1->leaf3; keep interactiveItems, swap only secondary reward target; mask add a few l over neutral cells; steps 10->11; keep dragonflies, do not touch interactiveItems.
265. donor 92; env forest->flowerFields; leaf leaf1->leaf3; goals lavanda->mushroom3, lilly->mushroom; mask some i->l; steps 12->13; keep no extra mechanics.
266. donor 89; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom3->lilly, lilly->mushroom; mask edge g->1; steps 9->10; keep dragonflies.
267. donor 138; env flowerFields->forest; leaf leaf1->leaf3; keep interactiveItems, swap only secondary reward target; mask add a few l over neutral cells; steps 9->10; keep dragonflies, do not touch interactiveItems.
268. donor 99; env forest->flowerFields; leaf leaf1->leaf3; goals lavanda->mushroom3, lilly->mushroom; mask add a few l over neutral cells; steps 7->8; keep no extra mechanics.
269. donor 100; env forest->flowerFields; leaf leaf1->leaf3; goals wheat->lavanda; mask edge g->1; steps 9->10; keep dragonflies.
270. donor 139; env flowerFields->forest; leaf leaf4->leaf1; keep interactiveItems, swap only secondary reward target; mask add a few l over neutral cells; steps 12->13; keep dragonflies, do not touch interactiveItems.
271. donor 105; env forest->flowerFields; leaf leaf1->leaf3; goals mushroom->lavanda; mask edge g->1; steps 10->11; keep no extra mechanics.
272. donor 101; env forest->flowerFields; leaf leaf1->leaf3; goals lilly->mushroom, wheat->lavanda; mask edge g->1; steps 8->9; keep ladybugs.
273. donor 142; env flowerFields->forest; leaf leaf1->leaf3; keep interactiveItems, swap only secondary reward target; mask add a few l over neutral cells; steps 12->13; keep dragonflies, do not touch interactiveItems.
274. donor 121; env darkForest->forest; leaf leaf3->leaf4; goals t27->t27; mask edge g->1; steps 16->17; keep no extra mechanics.
275. donor 102; env forest->flowerFields; leaf leaf4->leaf1; goals wheat->lavanda, lavanda->mushroom3; mask edge g->1; steps 7->8; keep dragonflies.
276. donor 146; env flowerFields->forest; leaf leaf1->leaf3; keep interactiveItems, swap only secondary reward target; mask add a few l over neutral cells; steps 10->11; keep dragonflies, do not touch interactiveItems.
277. donor 123; env darkForest->forest; leaf leaf1->leaf3; goals mushroom->lavanda; mask some i->l; steps 10->11; keep no extra mechanics.
278. donor 103; env forest->flowerFields; leaf leaf1->leaf3; goals lavanda->mushroom3, wheat->lavanda; mask some i->l; steps 12->13; keep dragonflies.
279. donor 147; env flowerFields->forest; leaf leaf1->leaf3; goals mushroom3->lilly, lilly->mushroom; mask edge g->1; steps 12->13; keep cankerberries, keep dragonflies.
280. donor 127; env darkForest->forest; leaf leaf1->leaf3; goals lilly->mushroom, witchMushroom->amanita; mask edge g->1; steps 9->10; keep no extra mechanics.
281. donor 106; env forest->flowerFields; leaf leaf1->leaf3; goals lilly->mushroom, lavanda->mushroom3; mask add a few l over neutral cells; steps 7->8; keep dragonflies.
282. donor 149; env flowerFields->forest; leaf leaf3->leaf4; keep interactiveItems, swap only secondary reward target; mask add a few l over neutral cells; steps 15->16; keep honey, keep dragonflies, do not touch interactiveItems.
283. donor 133; env forest->flowerFields; leaf leaf1->leaf3; goals lavanda->mushroom3, lilly->mushroom; mask edge g->1; steps 10->11; keep no extra mechanics.
284. donor 107; env forest->flowerFields; leaf leaf4->leaf1; goals mushroom3->lilly, lilly->mushroom; mask edge g->1; steps 11->12; keep hard pacing.
285. donor 110; env forest->flowerFields; leaf leaf3->leaf4; goals mushroom3->lilly, lavanda->mushroom3; mask edge g->1; steps 10->11; keep dragonflies.
286. donor 111; env forest->flowerFields; leaf leaf3->leaf4; goals mushroom3->lilly, lilly->mushroom; mask edge g->1; steps 8->9; keep cankerberries.
287. donor 113; env forest->flowerFields; leaf leaf3->leaf4; goals lilly->mushroom, goldRoot->amber; mask edge g->1; steps 9->10; keep dragonflies.
288. donor 116; env lake->flowerFields; leaf leaf1->leaf3; goals amber->goldRoot; mask add a few l over neutral cells; steps 12->13; keep dragonflies.
289. donor 117; env lake->flowerFields; leaf leaf1->leaf3; goals amber->goldRoot, mushroom4->mushroom5; mask edge g->1; steps 10->11; keep dragonflies.
290. donor 119; env darkForest->forest; leaf leaf4->leaf1; goals witchMushroom->amanita, mushroom5->mushroom4; mask edge g->1; steps 10->11; keep cankerberries.
291. donor 124; env darkForest->forest; leaf leaf1->leaf3; goals amanita->witchMushroom, lilly->mushroom; mask add a few l over neutral cells; steps 8->9; keep dragonflies.
292. donor 125; env darkForest->forest; leaf leaf3->leaf4; goals mushroom->lavanda; mask edge g->1; steps 10->11; keep dragonflies.
293. donor 132; env forest->flowerFields; leaf leaf1->leaf3; goals goldRoot->amber; mask edge g->1; steps 11->12; keep dragonflies.
294. donor 134; env flowerFields->forest; leaf leaf1->leaf3; goals strawberry->blackberry, blackberry->strawberry; mask add a few l over neutral cells; steps 9->10; keep dragonflies.
295. donor 135; env flowerFields->forest; leaf leaf1->leaf3; goals strawberry->blackberry, mushroom4->mushroom5; mask edge g->1; steps 7->8; keep dragonflies.
296. donor 137; env flowerFields->forest; leaf leaf1->leaf3; goals blackberry->strawberry, mushroom4->mushroom5; mask edge g->1; steps 7->8; keep dragonflies.
297. donor 140; env flowerFields->forest; leaf leaf1->leaf3; goals blackberry->strawberry; mask edge g->1; steps 8->9; keep dragonflies.
298. donor 141; env flowerFields->forest; leaf leaf1->leaf3; goals lilly->mushroom; mask edge g->1; steps 9->10; keep dragonflies.
299. donor 143; env flowerFields->forest; leaf leaf1->leaf3; goals mushroom3->lilly, strawberry->blackberry; mask edge g->1; steps 10->11; keep dragonflies.
300. donor 144; env flowerFields->forest; leaf leaf1->leaf3; goals amanita->witchMushroom, lilly->mushroom; mask edge g->1; steps 13->14; keep dragonflies.
301. donor 145; env flowerFields->forest; leaf leaf1->leaf3; goals strawberry->blackberry, blackberry->strawberry; mask add a few l over neutral cells; steps 12->13; keep dragonflies.
302. donor 148; env flowerFields->forest; leaf leaf1->leaf3; goals mushroom->lavanda, lilly->mushroom; mask edge g->1; steps 8->9; keep dragonflies.
303. donor 150; env flowerFields->forest; leaf leaf1->leaf3; goals lavanda->mushroom3; mask add a few l over neutral cells; steps 7->8; keep dragonflies.
304. donor 151; env flowerFields->forest; leaf leaf3->leaf4; goals lilly->mushroom, goldRoot->amber; mask edge g->1; steps 17->18; keep dragonflies.
305. donor 152; env flowerFields->forest; leaf leaf1->leaf3; goals lilly->mushroom, goldRoot->amber; mask add a few l over neutral cells; steps 9->10; keep dragonflies.
306. donor 153; env flowerFields->forest; leaf leaf1->leaf3; goals mushroom3->lilly, goldRoot->amber; mask edge g->1; steps 8->9; keep cankerberries.

### Wave B: 307-459

307. donor 149; env flowerFields->lake; leaf leaf3->leaf1; keep interactiveItems, rotate only secondary reward target; mask convert a few neutral cells to m; steps 15->14; keep honey, keep dragonflies, do not touch interactiveItems.
308. donor 133; env forest->darkForest; leaf leaf1->leaf4; goals lavanda->lilly, lilly->blackberry; mask core g->m; steps 10->9; keep no extra mechanics.
309. donor 153; env flowerFields->lake; leaf leaf1->leaf4; goals mushroom3->lavanda, goldRoot->mushroom3; mask core g->m; steps 8->7; keep cankerberries.
310. donor 147; env flowerFields->lake; leaf leaf1->leaf4; goals mushroom3->lavanda, lilly->blackberry; mask core g->m; steps 12->11; keep cankerberries, keep dragonflies.
311. donor 127; env darkForest->flowerFields; leaf leaf1->leaf4; goals lilly->blackberry, witchMushroom->mushroom3; mask core g->m; steps 9->8; keep no extra mechanics.
312. donor 152; env flowerFields->lake; leaf leaf1->leaf4; goals lilly->blackberry, goldRoot->mushroom3; mask convert a few neutral cells to m; steps 9->8; keep dragonflies.
313. donor 146; env flowerFields->lake; leaf leaf1->leaf4; keep interactiveItems, rotate only secondary reward target; mask convert a few neutral cells to m; steps 10->9; keep dragonflies, do not touch interactiveItems.
314. donor 123; env darkForest->flowerFields; leaf leaf1->leaf4; goals mushroom->mushroom3; mask some j->B; steps 10->9; keep no extra mechanics.
315. donor 151; env flowerFields->lake; leaf leaf3->leaf1; goals lilly->blackberry, goldRoot->mushroom3; mask core g->m; steps 17->16; keep dragonflies.
316. donor 142; env flowerFields->lake; leaf leaf1->leaf4; keep interactiveItems, rotate only secondary reward target; mask convert a few neutral cells to m; steps 12->11; keep dragonflies, do not touch interactiveItems.
317. donor 121; env darkForest->flowerFields; leaf leaf3->leaf1; goals t27->t27; mask core g->m; steps 16->15; keep no extra mechanics.
318. donor 150; env flowerFields->lake; leaf leaf1->leaf4; goals lavanda->lilly; mask convert a few neutral cells to m; steps 7->6; keep dragonflies.
319. donor 139; env flowerFields->lake; leaf leaf4->leaf3; keep interactiveItems, rotate only secondary reward target; mask convert a few neutral cells to m; steps 12->11; keep dragonflies, do not touch interactiveItems.
320. donor 105; env forest->darkForest; leaf leaf1->leaf4; goals mushroom->mushroom3; mask core g->m; steps 10->9; keep no extra mechanics.
321. donor 148; env flowerFields->lake; leaf leaf1->leaf4; goals mushroom->mushroom3, lilly->blackberry; mask core g->m; steps 8->7; keep dragonflies.
322. donor 138; env flowerFields->lake; leaf leaf1->leaf4; keep interactiveItems, rotate only secondary reward target; mask convert a few neutral cells to m; steps 9->8; keep dragonflies, do not touch interactiveItems.
323. donor 99; env forest->darkForest; leaf leaf1->leaf4; goals lavanda->lilly, lilly->blackberry; mask convert a few neutral cells to m; steps 7->6; keep no extra mechanics.
324. donor 145; env flowerFields->lake; leaf leaf1->leaf4; goals strawberry->lilly, blackberry->lavanda; mask convert a few neutral cells to m; steps 12->11; keep dragonflies.
325. donor 136; env flowerFields->lake; leaf leaf1->leaf4; keep interactiveItems, rotate only secondary reward target; mask convert a few neutral cells to m; steps 10->9; keep dragonflies, do not touch interactiveItems.
326. donor 92; env forest->darkForest; leaf leaf1->leaf4; goals lavanda->lilly, lilly->blackberry; mask some i->A; steps 12->11; keep no extra mechanics.
327. donor 144; env flowerFields->lake; leaf leaf1->leaf4; goals amanita->lavanda, lilly->blackberry; mask core g->m; steps 13->12; keep dragonflies.
328. donor 131; env forest->darkForest; leaf leaf1->leaf4; goals lilly->blackberry, amanita->lavanda; mask core g->m; steps 12->11; keep dragonflies, soften hard pacing by 1 step only.
329. donor 91; env forest->darkForest; leaf leaf4->leaf3; goals lilly->blackberry, goldRoot->mushroom3; mask core g->m; steps 16->15; keep no extra mechanics.
330. donor 143; env flowerFields->lake; leaf leaf1->leaf4; goals mushroom3->lavanda, strawberry->lilly; mask core g->m; steps 10->9; keep dragonflies.
331. donor 130; env forest->darkForest; leaf leaf1->leaf4; goals mushroom->mushroom3, witchMushroom->mushroom3; mask core g->m; steps 6->6; keep acorns, soften hard pacing by 1 step only.
332. donor 84; env forest->darkForest; leaf leaf1->leaf4; goals lavanda->lilly, lilly->blackberry; mask convert a few neutral cells to m; steps 8->7; keep no extra mechanics.
333. donor 141; env flowerFields->lake; leaf leaf1->leaf4; goals lilly->blackberry; mask core g->m; steps 9->8; keep dragonflies.
334. donor 129; env darkForest->flowerFields; leaf leaf1->leaf4; keep interactiveItems, rotate only secondary reward target; mask core g->m; steps 8->7; keep cankerberries, keep dragonflies, do not touch interactiveItems.
335. donor 83; env forest->darkForest; leaf leaf1->leaf4; goals witchMushroom->mushroom3; mask core g->m; steps 10->9; keep no extra mechanics.
336. donor 140; env flowerFields->lake; leaf leaf1->leaf4; goals blackberry->lavanda; mask core g->m; steps 8->7; keep dragonflies.
337. donor 128; env darkForest->flowerFields; leaf leaf1->leaf4; goals mushroom3->lavanda; mask core g->m; steps 9->8; keep honey, keep dragonflies.
338. donor 79; env forest->darkForest; leaf leaf1->leaf4; goals lavanda->lilly, mushroom4->strawberry; mask core g->m; steps 9->8; keep no extra mechanics.
339. donor 137; env flowerFields->lake; leaf leaf1->leaf4; goals blackberry->lavanda, mushroom4->strawberry; mask core g->m; steps 7->6; keep dragonflies.
340. donor 126; env darkForest->flowerFields; leaf leaf4->leaf3; goals witchMushroom->mushroom3; mask core g->m; steps 13->12; keep cankerberries, keep dragonflies.
341. donor 78; env house->house; leaf hexChest->hexChest; goals t24->t24; mask core g->m; steps 10->9; keep no extra mechanics.
342. donor 135; env flowerFields->lake; leaf leaf1->leaf4; goals strawberry->lilly, mushroom4->strawberry; mask core g->m; steps 7->6; keep dragonflies.
343. donor 122; env darkForest->flowerFields; leaf leaf4->leaf3; goals mushroom->mushroom3; mask core g->m; steps 16->15; keep acorns, keep dragonflies.
344. donor 74; env house->house; leaf hexChest->hexChest; goals t25->t25; mask core g->m; steps 11->10; keep no extra mechanics.
345. donor 134; env flowerFields->lake; leaf leaf1->leaf4; goals strawberry->lilly, blackberry->lavanda; mask convert a few neutral cells to m; steps 9->8; keep dragonflies.
346. donor 120; env darkForest->flowerFields; leaf leaf1->leaf4; keep interactiveItems, rotate only secondary reward target; mask convert a few neutral cells to m; steps 11->10; keep dragonflies, do not touch interactiveItems.
347. donor 64; env forest->darkForest; leaf leaf1->leaf4; goals mushroom->mushroom3; mask some j->B; steps 10->9; keep no extra mechanics.
348. donor 132; env forest->darkForest; leaf leaf1->leaf4; goals goldRoot->mushroom3; mask core g->m; steps 11->10; keep dragonflies.
349. donor 118; env lake->forest; leaf leaf1->leaf4; keep interactiveItems, rotate only secondary reward target; mask convert a few neutral cells to m; steps 7->6; keep dragonflies, do not touch interactiveItems.
350. donor 63; env forest->darkForest; leaf leaf1->leaf4; goals lavanda->lilly, lilly->blackberry; mask convert a few neutral cells to m; steps 7->6; keep no extra mechanics.
351. donor 125; env darkForest->flowerFields; leaf leaf3->leaf1; goals mushroom->mushroom3; mask core g->m; steps 10->9; keep dragonflies.
352. donor 115; env lake->forest; leaf leaf1->leaf4; keep interactiveItems, rotate only secondary reward target; mask core g->m; steps 7->6; keep dragonflies, do not touch interactiveItems.
353. donor 55; env forest->darkForest; leaf leaf1->leaf4; goals mushroom->mushroom3, lilly->blackberry; mask core g->m; steps 10->9; keep no extra mechanics.
354. donor 124; env darkForest->flowerFields; leaf leaf1->leaf4; goals amanita->lavanda, lilly->blackberry; mask convert a few neutral cells to m; steps 8->7; keep dragonflies.
355. donor 114; env forest->darkForest; leaf leaf4->leaf3; goals goldRoot->mushroom3; mask core g->m; steps 14->13; keep honey, keep dragonflies.
356. donor 52; env forest->darkForest; leaf leaf3->leaf1; goals mushroom->mushroom3, lilly->blackberry; mask core g->m; steps 8->7; keep no extra mechanics.
357. donor 119; env darkForest->flowerFields; leaf leaf4->leaf3; goals witchMushroom->mushroom3, mushroom5->blackberry; mask core g->m; steps 10->9; keep cankerberries.
358. donor 112; env forest->darkForest; leaf leaf1->leaf4; keep interactiveItems, rotate only secondary reward target; mask convert a few neutral cells to m; steps 14->13; keep dragonflies, do not touch interactiveItems.
359. donor 49; env forest->darkForest; leaf leaf1->leaf4; goals mushroom->mushroom3, lavanda->lilly; mask core g->m; steps 8->7; keep no extra mechanics.
360. donor 117; env lake->forest; leaf leaf1->leaf4; goals amber->lilly, mushroom4->strawberry; mask core g->m; steps 10->9; keep dragonflies.
361. donor 109; env forest->darkForest; leaf leaf1->leaf4; goals mushroom->mushroom3; mask core g->m; steps 11->10; keep flowers, keep dragonflies.
362. donor 48; env forest->darkForest; leaf leaf3->leaf1; goals lavanda->lilly, lilly->blackberry; mask core g->m; steps 9->8; keep no extra mechanics.
363. donor 116; env lake->forest; leaf leaf1->leaf4; goals amber->lilly; mask convert a few neutral cells to m; steps 12->11; keep dragonflies.
364. donor 108; env forest->darkForest; leaf leaf1->leaf4; goals mushroom->mushroom3; mask core g->m; steps 6->6; keep honey, keep dragonflies.
365. donor 47; env forest->darkForest; leaf leaf1->leaf4; goals poleno->mushroom; mask core g->m; steps 10->9; keep no extra mechanics.
366. donor 113; env forest->darkForest; leaf leaf3->leaf1; goals lilly->blackberry, goldRoot->mushroom3; mask core g->m; steps 9->8; keep dragonflies.
367. donor 104; env forest->darkForest; leaf leaf3->leaf1; goals wheat->mushroom, witchMushroom->mushroom3; mask core g->m; steps 10->9; keep cankerberries, keep dragonflies, soften hard pacing by 1 step only.
368. donor 44; env darkForest->flowerFields; leaf leaf1->leaf4; goals lilly->blackberry, witchMushroom->mushroom3; mask core g->m; steps 9->8; keep no extra mechanics.
369. donor 111; env forest->darkForest; leaf leaf3->leaf1; goals mushroom3->lavanda, lilly->blackberry; mask core g->m; steps 8->7; keep cankerberries.
370. donor 98; env lake->forest; leaf leaf3->leaf1; keep interactiveItems, rotate only secondary reward target; mask convert a few neutral cells to m; steps 11->10; keep dragonflies, do not touch interactiveItems.
371. donor 41; env darkForest->flowerFields; leaf leaf1->leaf4; goals mushroom->mushroom3, witchMushroom->mushroom3; mask core g->m; steps 7->6; keep no extra mechanics.
372. donor 110; env forest->darkForest; leaf leaf3->leaf1; goals mushroom3->lavanda, lavanda->lilly; mask core g->m; steps 10->9; keep dragonflies.
373. donor 97; env lake->forest; leaf leaf1->leaf4; keep interactiveItems, rotate only secondary reward target; mask convert a few neutral cells to m; steps 8->7; keep dragonflies, do not touch interactiveItems.
374. donor 40; env darkForest->flowerFields; leaf leaf4->leaf3; goals mushroom->mushroom3, mushroom3->lavanda; mask core g->m; steps 7->6; keep no extra mechanics.
375. donor 107; env forest->darkForest; leaf leaf4->leaf3; goals mushroom3->lavanda, lilly->blackberry; mask core g->m; steps 11->10; soften hard pacing by 1 step only.
376. donor 96; env lake->forest; leaf leaf1->leaf4; keep interactiveItems, rotate only secondary reward target; mask core g->m; steps 10->9; keep dragonflies, do not touch interactiveItems.
377. donor 34; env darkForest->flowerFields; leaf leaf4->leaf3; goals lilly->blackberry, mushroom->mushroom3; mask core g->m; steps 10->9; keep no extra mechanics.
378. donor 106; env forest->darkForest; leaf leaf1->leaf4; goals lilly->blackberry, lavanda->lilly; mask convert a few neutral cells to m; steps 7->6; keep dragonflies.
379. donor 95; env lake->forest; leaf leaf1->leaf4; keep interactiveItems, rotate only secondary reward target; mask convert a few neutral cells to m; steps 7->6; keep dragonflies, do not touch interactiveItems.
380. donor 33; env darkForest->flowerFields; leaf leaf3->leaf1; goals witchMushroom->mushroom3, amanita->lavanda; mask core g->m; steps 12->11; keep no extra mechanics.
381. donor 103; env forest->darkForest; leaf leaf1->leaf4; goals lavanda->lilly, wheat->mushroom; mask some j->B; steps 12->11; keep dragonflies.
382. donor 94; env lake->forest; leaf leaf1->leaf4; keep interactiveItems, rotate only secondary reward target; mask convert a few neutral cells to m; steps 8->7; keep dragonflies, do not touch interactiveItems.
383. donor 32; env forest->darkForest; leaf leaf1->leaf4; goals mushroom->mushroom3; mask core g->m; steps 15->14; keep no extra mechanics.
384. donor 102; env forest->darkForest; leaf leaf4->leaf3; goals wheat->mushroom, lavanda->lilly; mask core g->m; steps 7->6; keep dragonflies.
385. donor 93; env lake->forest; leaf leaf4->leaf3; keep interactiveItems, rotate only secondary reward target; mask core g->m; steps 10->9; keep dragonflies, do not touch interactiveItems.
386. donor 30; env forest->darkForest; leaf leaf1->leaf4; goals lavanda->lilly, mushroom->mushroom3; mask core g->m; steps 8->7; keep no extra mechanics.
387. donor 101; env forest->darkForest; leaf leaf1->leaf4; goals lilly->blackberry, wheat->mushroom; mask core g->m; steps 8->7; keep ladybugs.
388. donor 90; env forest->darkForest; leaf leaf4->leaf3; goals witchMushroom->mushroom3, goldRoot->mushroom3; mask core g->m; steps 10->9; keep acorns, keep dragonflies.
389. donor 29; env forest->darkForest; leaf leaf1->leaf4; goals lilly->blackberry; mask core g->m; steps 15->14; keep no extra mechanics.
390. donor 100; env forest->darkForest; leaf leaf1->leaf4; goals wheat->mushroom; mask core g->m; steps 9->8; keep dragonflies.
391. donor 88; env forest->darkForest; leaf leaf4->leaf3; goals witchMushroom->mushroom3, lavanda->lilly; mask core g->m; steps 14->13; keep acorns, soften hard pacing by 1 step only.
392. donor 26; env forest->darkForest; leaf leaf4->leaf3; goals mushroom3->lavanda, lilly->blackberry; mask core g->m; steps 13->12; keep no extra mechanics.
393. donor 89; env forest->darkForest; leaf leaf1->leaf4; goals mushroom3->lavanda, lilly->blackberry; mask core g->m; steps 9->8; keep dragonflies.
394. donor 87; env forest->darkForest; leaf leaf1->leaf4; goals goldRoot->mushroom3; mask core g->m; steps 7->6; keep honey, keep dragonflies, do not touch separators.
395. donor 25; env forest->darkForest; leaf leaf1->leaf4; goals mushroom3->lavanda, lavanda->lilly; mask core g->m; steps 13->12; keep no extra mechanics.
396. donor 82; env forest->darkForest; leaf leaf1->leaf4; goals lavanda->lilly, mushroom4->strawberry; mask some i->A; steps 6->6; keep dragonflies.
397. donor 86; env forest->darkForest; leaf leaf1->leaf4; goals lavanda->lilly, goldRoot->mushroom3; mask core g->m; steps 8->7; keep dragonflies, do not touch separators.
398. donor 23; env forest->darkForest; leaf leaf3->leaf1; goals mushroom3->lavanda, lavanda->lilly; mask core g->m; steps 14->13; keep no extra mechanics.
399. donor 81; env forest->darkForest; leaf leaf1->leaf4; goals lilly->blackberry, mushroom3->lavanda; mask core g->m; steps 11->10; keep dragonflies.
400. donor 85; env forest->darkForest; leaf leaf1->leaf4; goals mushroom->mushroom3; mask core g->m; steps 10->9; keep cankerberries, keep dragonflies, do not touch separators.
401. donor 22; env forest->darkForest; leaf leaf1->leaf4; goals mushroom->mushroom3, lavanda->lilly; mask some j->B; steps 10->9; keep no extra mechanics.
402. donor 77; env house->house; leaf hexChest->hexChest; goals t27->t27; mask core g->m; steps 6->6; soften hard pacing by 1 step only.
403. donor 80; env forest->darkForest; leaf leaf4->leaf3; goals witchMushroom->mushroom3; mask core g->m; steps 8->7; keep acorns, keep honey, keep dragonflies.
404. donor 21; env forest->darkForest; leaf leaf4->leaf3; goals witchMushroom->mushroom3, lilly->blackberry; mask core g->m; steps 7->6; keep no extra mechanics.
405. donor 76; env house->house; leaf hexChest->hexChest; keep randomItems 10, rotate reward pool and bonus entry; mask core g->m; steps 8->7; keep randomItems.
406. donor 73; env house->house; leaf hexChest->hexChest; keep randomItems 12, rotate reward pool and bonus entry; mask core g->m; steps 9->8; keep dragonflies, keep randomItems, soften hard pacing by 1 step only.
407. donor 20; env forest->darkForest; leaf leaf3->leaf1; goals mushroom->mushroom3; mask core g->m; steps 9->8; keep no extra mechanics.
408. donor 75; env house->house; leaf hexChest->hexChest; goals t1->t1; mask core g->m; steps 9->8; keep honey.
409. donor 71; env house->house; leaf hexChest->hexChest; keep randomItems 6, rotate reward pool and bonus entry; mask core g->m; steps 9->8; keep dragonflies, keep randomItems.
410. donor 19; env forest->darkForest; leaf leaf4->leaf3; keep empty-target pacing with stronger booster pressure; mask core g->m; steps 11->10; keep no extra mechanics.
411. donor 72; env house->house; leaf hexChest->hexChest; keep randomItems 10, rotate reward pool and bonus entry; mask core g->m; steps 15->14; keep randomItems.
412. donor 69; env house->house; leaf hexChest->hexChest; keep randomItems 9, rotate reward pool and bonus entry; mask core g->m; steps 7->6; keep dragonflies, keep randomItems.
413. donor 16; env forest->darkForest; leaf leaf1->leaf4; goals mushroom3->lavanda, lilly->blackberry; mask core g->m; steps 6->6; keep no extra mechanics.
414. donor 70; env house->house; leaf hexChest->hexChest; keep randomItems 7, rotate reward pool and bonus entry; mask core g->m; steps 6->6; keep randomItems.
415. donor 68; env house->house; leaf hexChest->hexChest; keep randomItems 12, rotate reward pool and bonus entry; mask core g->m; steps 13->12; keep dragonflies, keep randomItems.
416. donor 15; env forest->darkForest; leaf leaf1->leaf4; goals mushroom3->lavanda, lilly->blackberry; mask core g->m; steps 9->8; keep no extra mechanics.
417. donor 67; env house->house; leaf hexChest->hexChest; keep randomItems 12, rotate reward pool and bonus entry; mask core g->m; steps 8->7; keep randomItems.
418. donor 58; env forest->darkForest; leaf leaf3->leaf1; goals lavanda->lilly, witchMushroom->mushroom3; mask core g->m; steps 10->9; keep honey, keep dragonflies.
419. donor 14; env forest->darkForest; leaf leaf1->leaf4; goals mushroom3->lavanda; mask core g->m; steps 10->9; keep no extra mechanics.
420. donor 66; env house->house; leaf hexChest->hexChest; keep randomItems 6, rotate reward pool and bonus entry; mask core g->m; steps 8->7; keep randomItems.
421. donor 57; env forest->darkForest; leaf leaf1->leaf4; goals mushroom->mushroom3, witchMushroom->mushroom3; mask core g->m; steps 11->10; keep honey, keep dragonflies.
422. donor 11; env forest->darkForest; leaf leaf1->leaf4; goals mushroom->mushroom3, mushroom3->lavanda; mask core g->m; steps 10->9; keep no extra mechanics.
423. donor 65; env house->house; leaf hexChest->hexChest; keep randomItems 9, rotate reward pool and bonus entry; mask core g->m; steps 9->8; keep randomItems.
424. donor 51; env forest->darkForest; leaf leaf4->leaf3; goals mushroom3->lavanda; mask core g->m; steps 9->8; keep flowers, keep dragonflies, soften hard pacing by 1 step only.
425. donor 7; env snailForest->bugForest; leaf leaf1->leaf4; goals mushroom->mushroom3, witchMushroom->mushroom3; mask core g->m; steps 10->9; keep no extra mechanics.
426. donor 62; env forest->darkForest; leaf leaf1->leaf4; goals mushroom->mushroom3; mask core g->m; steps 8->7; keep dragonflies.
427. donor 43; env darkForest->flowerFields; leaf leaf4->leaf3; goals witchMushroom->mushroom3; mask core g->m; steps 11->10; keep acorns, soften hard pacing by 1 step only.
428. donor 6; env jungles->forest; leaf leaf4->leaf3; goals mushroom3->lavanda; mask core g->m; steps 11->10; keep no extra mechanics.
429. donor 61; env forest->darkForest; leaf leaf3->leaf1; goals mushroom->mushroom3, mushroom3->lavanda; mask core g->m; steps 7->6; keep dragonflies.
430. donor 35; env darkForest->flowerFields; leaf leaf1->leaf4; goals witchMushroom->mushroom3; mask core g->m; steps 12->11; keep jelly, keep dragonflies.
431. donor 5; env jungles->forest; leaf leaf1->leaf4; goals mushroom->mushroom3; mask core g->m; steps 9->8; keep no extra mechanics.
432. donor 60; env forest->darkForest; leaf leaf1->leaf4; goals mushroom3->lavanda, lavanda->lilly; mask core g->m; steps 15->14; soften hard pacing by 1 step only.
433. donor 27; env forest->darkForest; leaf leaf1->leaf4; goals lavanda->lilly; mask convert a few neutral cells to m; steps 17->16; keep ladybugs, soften hard pacing by 1 step only.
434. donor 2; env forest->darkForest; leaf leaf4->leaf3; goals mushroom->mushroom3; mask core g->m; steps 8->7; keep no extra mechanics.
435. donor 59; env forest->darkForest; leaf leaf4->leaf3; goals mushroom->mushroom3; mask core g->m; steps 14->13; keep dragonflies.
436. donor 1; env forest->darkForest; leaf leaf1->leaf4; goals mushroom->mushroom3; mask core g->m; steps 10->9; keep no extra mechanics.
437. donor 56; env forest->darkForest; leaf leaf1->leaf4; goals lilly->blackberry; mask some j->B; steps 9->8; keep cankerberries.
438. donor 54; env forest->darkForest; leaf leaf1->leaf4; goals lavanda->lilly, lilly->blackberry; mask core g->m; steps 10->9; keep ladybugs.
439. donor 53; env forest->darkForest; leaf leaf1->leaf4; goals lavanda->lilly, lilly->blackberry; mask core g->m; steps 9->8; keep cankerberries.
440. donor 50; env forest->darkForest; leaf leaf4->leaf3; goals mushroom->mushroom3, witchMushroom->mushroom3; mask core g->m; steps 11->10; keep cankerberries.
441. donor 46; env forest->darkForest; leaf leaf4->leaf3; goals lilly->blackberry; mask core g->m; steps 14->13; keep acorns.
442. donor 45; env forest->darkForest; leaf leaf4->leaf3; goals mushroom3->lavanda, mushroom->mushroom3; mask core g->m; steps 10->9; keep acorns.
443. donor 42; env darkForest->flowerFields; leaf leaf3->leaf1; goals mushroom3->lavanda; mask core g->m; steps 11->10; keep cankerberries.
444. donor 39; env darkForest->flowerFields; leaf leaf4->leaf3; goals mushroom->mushroom3, witchMushroom->mushroom3; mask core g->m; steps 10->9; keep acorns.
445. donor 38; env darkForest->flowerFields; leaf leaf4->leaf3; goals witchMushroom->mushroom3; mask core g->m; steps 11->10; keep acorns.
446. donor 37; env darkForest->flowerFields; leaf leaf4->leaf3; goals witchMushroom->mushroom3, lilly->blackberry; mask core g->m; steps 12->11; soften hard pacing by 1 step only.
447. donor 36; env darkForest->flowerFields; leaf leaf4->leaf3; goals witchMushroom->mushroom3; mask core g->m; steps 12->11; keep jelly.
448. donor 31; env forest->darkForest; leaf leaf1->leaf4; goals witchMushroom->mushroom3, lilly->blackberry; mask core g->m; steps 11->10; keep cankerberries.
449. donor 28; env forest->darkForest; leaf leaf1->leaf4; goals witchMushroom->mushroom3; mask core g->m; steps 14->13; keep cankerberries.
450. donor 24; env forest->darkForest; leaf leaf1->leaf4; goals lavanda->lilly, witchMushroom->mushroom3; mask core g->m; steps 11->10; keep cankerberries.
451. donor 18; env forest->darkForest; leaf leaf1->leaf4; goals lilly->blackberry, mushroom->mushroom3; mask core g->m; steps 11->10; keep ladybugs.
452. donor 17; env forest->darkForest; leaf leaf4->leaf3; goals mushroom3->lavanda; mask core g->m; steps 12->11; keep ladybugs.
453. donor 13; env forest->darkForest; leaf leaf1->leaf4; goals mushroom->mushroom3; mask core g->m; steps 14->13; keep flowers.
454. donor 12; env forest->darkForest; leaf leaf3->leaf1; keep empty-target pacing with stronger booster pressure; mask core g->m; steps 8->7; keep flowers.
455. donor 10; env bugForest->forest; leaf leaf1->leaf4; goals mushroom->mushroom3; mask core g->m; steps 10->9; keep ladybugs.
456. donor 9; env bugForest->forest; leaf leaf4->leaf3; keep empty-target pacing with stronger booster pressure; mask core g->m; steps 9->8; keep ladybugs.
457. donor 8; env snailForest->bugForest; leaf leaf3->leaf1; goals mushroom->mushroom3; mask core g->m; steps 7->6; keep dragonflies.
458. donor 4; env house->house; leaf hexChest->hexChest; keep randomItems 6, rotate reward pool and bonus entry; mask core g->m; steps 10->9; keep randomItems.
459. donor 3; env house->house; leaf hexChest->hexChest; keep randomItems 5, rotate reward pool and bonus entry; mask core g->m; steps 10->9; keep randomItems.

### Wave C: 460-500

460. donor 1; env forest->lake; leaf leaf1->leaf1; goals mushroom->strawberry; mask lower g->2; steps 10->12; keep no extra mechanics.
461. donor 3; env house->house; leaf hexChest->hexChest; keep randomItems 5, add endgame reward weighting; mask lower g->2; steps 10->12; keep randomItems.
462. donor 2; env forest->lake; leaf leaf4->leaf4; goals mushroom->strawberry; mask lower g->2; steps 8->10; keep no extra mechanics.
463. donor 4; env house->house; leaf hexChest->hexChest; keep randomItems 6, add endgame reward weighting; mask lower g->2; steps 10->12; keep randomItems.
464. donor 5; env jungles->bugForest; leaf leaf1->leaf1; goals mushroom->strawberry; mask lower g->2; steps 9->11; keep no extra mechanics.
465. donor 8; env snailForest->forest; leaf leaf3->leaf3; goals mushroom->strawberry; mask lower g->2; steps 7->9; keep dragonflies.
466. donor 6; env jungles->bugForest; leaf leaf4->leaf4; goals mushroom3->amber; mask lower g->2; steps 11->13; keep no extra mechanics.
467. donor 9; env bugForest->jungles; leaf leaf4->leaf4; keep empty-target pacing, rely on board texture change; mask lower g->2; steps 9->11; keep ladybugs.
468. donor 7; env snailForest->forest; leaf leaf1->leaf1; goals mushroom->strawberry, witchMushroom->blackberry; mask lower g->2; steps 10->12; keep no extra mechanics.
469. donor 10; env bugForest->jungles; leaf leaf1->leaf1; goals mushroom->strawberry; mask lower g->2; steps 10->12; keep ladybugs.
470. donor 11; env forest->lake; leaf leaf1->leaf1; goals mushroom->strawberry, mushroom3->amber; mask lower g->2; steps 10->12; keep no extra mechanics.
471. donor 12; env forest->lake; leaf leaf3->leaf3; keep empty-target pacing, rely on board texture change; mask lower g->2; steps 8->10; keep flowers.
472. donor 14; env forest->lake; leaf leaf1->leaf1; goals mushroom3->amber; mask lower g->2; steps 10->12; keep no extra mechanics.
473. donor 13; env forest->lake; leaf leaf1->leaf1; goals mushroom->strawberry; mask lower g->2; steps 14->16; keep flowers.
474. donor 15; env forest->lake; leaf leaf1->leaf1; goals mushroom3->amber, lilly->lavanda; mask lower g->2; steps 9->11; keep no extra mechanics.
475. donor 17; env forest->lake; leaf leaf4->leaf4; goals mushroom3->amber; mask lower g->2; steps 12->14; keep ladybugs.
476. donor 16; env forest->lake; leaf leaf1->leaf1; goals mushroom3->amber, lilly->lavanda; mask lower g->2; steps 6->8; keep no extra mechanics.
477. donor 18; env forest->lake; leaf leaf1->leaf1; goals lilly->lavanda, mushroom->strawberry; mask lower g->2; steps 11->13; keep ladybugs.
478. donor 19; env forest->lake; leaf leaf4->leaf4; keep empty-target pacing, rely on board texture change; mask lower g->2; steps 11->13; keep no extra mechanics.
479. donor 24; env forest->lake; leaf leaf1->leaf1; goals lavanda->strawberry, witchMushroom->blackberry; mask lower g->2; steps 11->13; keep cankerberries.
480. donor 20; env forest->lake; leaf leaf3->leaf3; goals mushroom->strawberry; mask lower g->2; steps 9->11; keep no extra mechanics.
481. donor 28; env forest->lake; leaf leaf1->leaf1; goals witchMushroom->blackberry; mask lower g->2; steps 14->16; keep cankerberries.
482. donor 21; env forest->lake; leaf leaf4->leaf4; goals witchMushroom->blackberry, lilly->lavanda; mask lower g->2; steps 7->9; keep no extra mechanics.
483. donor 31; env forest->lake; leaf leaf1->leaf1; goals witchMushroom->blackberry, lilly->lavanda; mask lower g->2; steps 11->13; keep cankerberries.
484. donor 22; env forest->lake; leaf leaf1->leaf1; goals mushroom->strawberry, lavanda->strawberry; mask some i->B; steps 10->12; keep no extra mechanics.
485. donor 36; env darkForest->lake; leaf leaf4->leaf4; goals witchMushroom->blackberry; mask lower g->2; steps 12->14; keep jelly.
486. donor 23; env forest->lake; leaf leaf3->leaf3; goals mushroom3->amber, lavanda->strawberry; mask lower g->2; steps 14->16; keep no extra mechanics.
487. donor 37; env darkForest->lake; leaf leaf4->leaf4; goals witchMushroom->blackberry, lilly->lavanda; mask lower g->2; steps 12->14; leave hard pacing unchanged.
488. donor 25; env forest->lake; leaf leaf1->leaf1; goals mushroom3->amber, lavanda->strawberry; mask lower g->2; steps 13->15; keep no extra mechanics.
489. donor 38; env darkForest->lake; leaf leaf4->leaf4; goals witchMushroom->blackberry; mask lower g->2; steps 11->13; keep acorns.
490. donor 26; env forest->lake; leaf leaf4->leaf4; goals mushroom3->amber, lilly->lavanda; mask lower g->2; steps 13->15; keep no extra mechanics.
491. donor 39; env darkForest->lake; leaf leaf4->leaf4; goals mushroom->strawberry, witchMushroom->blackberry; mask lower g->2; steps 10->12; keep acorns.
492. donor 29; env forest->lake; leaf leaf1->leaf1; goals lilly->lavanda; mask lower g->2; steps 15->17; keep no extra mechanics.
493. donor 42; env darkForest->lake; leaf leaf3->leaf3; goals mushroom3->amber; mask lower g->2; steps 11->13; keep cankerberries.
494. donor 30; env forest->lake; leaf leaf1->leaf1; goals lavanda->strawberry, mushroom->strawberry; mask lower g->2; steps 8->10; keep no extra mechanics.
495. donor 45; env forest->lake; leaf leaf4->leaf4; goals mushroom3->amber, mushroom->strawberry; mask lower g->2; steps 10->12; keep acorns.
496. donor 32; env forest->lake; leaf leaf1->leaf1; goals mushroom->strawberry; mask lower g->2; steps 15->17; keep no extra mechanics.
497. donor 46; env forest->lake; leaf leaf4->leaf4; goals lilly->lavanda; mask lower g->2; steps 14->16; keep acorns.
498. donor 33; env darkForest->lake; leaf leaf3->leaf3; goals witchMushroom->blackberry, amanita->mushroom; mask lower g->2; steps 12->14; keep no extra mechanics.
499. donor 50; env forest->lake; leaf leaf4->leaf4; goals mushroom->strawberry, witchMushroom->blackberry; mask lower g->2; steps 11->13; keep cankerberries.
500. donor 34; env darkForest->lake; leaf leaf4->leaf4; goals lilly->lavanda, mushroom->strawberry; mask lower g->2; steps 10->12; keep no extra mechanics.
